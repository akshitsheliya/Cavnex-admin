// import React, { useState, useEffect, useRef } from "react";
// import { useNavigate } from "react-router-dom";
// import StatCard from "../../components/dashboard/StatCard";
// import RecentActivity from "../../components/dashboard/RecentActivity";
// import QuickActions from "../../components/dashboard/QuickActions";
// import ChartCard from "../../components/dashboard/ChartCard";
// import Card from "../../components/common/Card";
// import Modal from "../../components/common/Modal";
// import useAuth from "../../hooks/useAuth";
// import api from "../../services/api";
// import leadService from "../../services/leadService";
// import clientService from "../../services/clientService";
// import projectService from "../../services/projectService";
// import invoiceService from "../../services/invoiceService";

// const Dashboard = () => {
//   const navigate = useNavigate();
//   const { user } = useAuth();
//   const [chartPeriod, setChartPeriod] = useState("year");
//   const [currentTime, setCurrentTime] = useState(new Date());
//   const [loading, setLoading] = useState(true);
//   const [data, setData] = useState({
//     leads: [],
//     clients: [],
//     projects: [],
//     invoices: [],
//   });
//   const [stats, setStats] = useState({
//     leads: {
//       total: 0,
//       qualified: 0,
//       conversionRate: 0,
//       totalValue: 0,
//       sourceCounts: {},
//       statusCounts: {},
//     },
//     clients: { total: 0, active: 0 },
//     projects: { total: 0, active: 0, completed: 0 },
//     revenue: { total: 0, paid: 0, pending: 0 },
//   });
//   const [monthlyRevenue, setMonthlyRevenue] = useState([]);
//   const [selectedActivity, setSelectedActivity] = useState(null);
//   const [showActivityModal, setShowActivityModal] = useState(false);
//   const [showRevenueModal, setShowRevenueModal] = useState(false);
//   const fetchedRef = useRef(false);

//   useEffect(() => {
//     const timer = setInterval(() => setCurrentTime(new Date()), 60000);
//     return () => clearInterval(timer);
//   }, []);

//   useEffect(() => {
//     if (!fetchedRef.current) {
//       fetchedRef.current = true;
//       fetchDashboardData();
//     }
//   }, []);

//   const fetchDashboardData = async () => {
//     setLoading(true);
//     try {
//       const [dataResults, statsResults] = await Promise.all([
//         Promise.allSettled([
//           api.get("/leads?limit=100"),
//           api.get("/clients?limit=100"),
//           api.get("/projects?limit=100"),
//           api.get("/invoices?limit=100"),
//         ]),
//         Promise.allSettled([
//           leadService.getLeadStats(),
//           clientService.getClientStats(),
//           projectService.getProjectStats(),
//           invoiceService.getInvoiceStats(),
//         ]),
//       ]);

//       const extractData = (result) => {
//         if (result.status === "fulfilled") {
//           const d = result.value.data.data || result.value.data;
//           return Array.isArray(d) ? d : [];
//         }
//         return [];
//       };

//       const extractStats = (result, defaultVal = {}) => {
//         if (result.status === "fulfilled") {
//           return result.value.data || defaultVal;
//         }
//         return defaultVal;
//       };

//       const leadsData = extractData(dataResults[0]);
//       const clientsData = extractData(dataResults[1]);
//       const projectsData = extractData(dataResults[2]);
//       const invoicesData = extractData(dataResults[3]);

//       setData({
//         leads: leadsData,
//         clients: clientsData,
//         projects: projectsData,
//         invoices: invoicesData,
//       });

//       const leadStats = extractStats(statsResults[0], {});
//       const clientStats = extractStats(statsResults[1], {});
//       const projectStats = extractStats(statsResults[2], {});
//       const invoiceStats = extractStats(statsResults[3], {});

//       // ✅ Calculate revenue from COMPLETED projects
//       const completedProjects = projectsData.filter(
//         (p) => p.status === "completed"
//       );
//       const totalRevenueFromProjects = completedProjects.reduce(
//         (sum, p) => sum + (p.budget || 0),
//         0
//       );
//       const paidAmountFromProjects = completedProjects.reduce(
//         (sum, p) => sum + (p.amountPaid || 0),
//         0
//       );
//       const pendingAmountFromProjects =
//         totalRevenueFromProjects - paidAmountFromProjects;

//       setStats({
//         leads: {
//           total: leadStats.totalLeads || leadsData.length || 0,
//           qualified: leadStats.statusCounts?.contacted || 0,
//           conversionRate: leadStats.conversionRate || 0,
//           totalValue: leadStats.totalValue || 0,
//           sourceCounts: leadStats.sourceCounts || {},
//           statusCounts: leadStats.statusCounts || {},
//         },
//         clients: {
//           total: clientStats.totalClients || clientsData.length || 0,
//           active: clientStats.activeClients || 0,
//         },
//         projects: {
//           total: projectStats.totalProjects || projectsData.length || 0,
//           active: projectStats.activeProjects || 0,
//           completed:
//             projectStats.completedProjects || completedProjects.length || 0,
//         },
//         // ✅ Revenue from completed projects
//         revenue: {
//           total: totalRevenueFromProjects,
//           paid: paidAmountFromProjects,
//           pending: pendingAmountFromProjects,
//         },
//       });

//       // ✅ Calculate monthly revenue from completed projects
//       const monthlyRevenueData = calculateMonthlyRevenue(completedProjects);
//       setMonthlyRevenue(monthlyRevenueData);
//     } catch (error) {
//       console.error("Failed to fetch dashboard data:", error);
//     } finally {
//       setLoading(false);
//     }
//   };

//   // ✅ NEW: Calculate monthly revenue from completed projects
//   const calculateMonthlyRevenue = (completedProjects) => {
//     const monthNames = [
//       "January",
//       "February",
//       "March",
//       "April",
//       "May",
//       "June",
//       "July",
//       "August",
//       "September",
//       "October",
//       "November",
//       "December",
//     ];

//     const currentYear = new Date().getFullYear();
//     const monthlyData = {};

//     completedProjects.forEach((project) => {
//       // Use completedDate or updatedAt or createdAt
//       const completionDate = new Date(
//         project.completedDate || project.updatedAt || project.createdAt
//       );
//       const year = completionDate.getFullYear();
//       const month = completionDate.getMonth();

//       // Only include current year data
//       if (year === currentYear) {
//         const key = `${year}-${month}`;
//         if (!monthlyData[key]) {
//           monthlyData[key] = {
//             month: monthNames[month],
//             year: year,
//             total: 0,
//             paid: 0,
//             pending: 0,
//             projectCount: 0,
//             projects: [],
//           };
//         }
//         monthlyData[key].total += project.budget || 0;
//         monthlyData[key].paid += project.amountPaid || 0;
//         monthlyData[key].pending +=
//           (project.budget || 0) - (project.amountPaid || 0);
//         monthlyData[key].projectCount += 1;
//         monthlyData[key].projects.push({
//           name: project.projectName || project.name,
//           budget: project.budget,
//           amountPaid: project.amountPaid,
//           client: project.client?.businessName || project.client?.clientName,
//         });
//       }
//     });

//     // Convert to array and sort by month
//     return Object.values(monthlyData).sort((a, b) => {
//       const aIndex = monthNames.indexOf(a.month);
//       const bIndex = monthNames.indexOf(b.month);
//       return bIndex - aIndex; // Most recent first
//     });
//   };

//   const handleRefresh = () => {
//     fetchedRef.current = false;
//     fetchDashboardData();
//   };

//   const getGreeting = () => {
//     const hour = currentTime.getHours();
//     if (hour < 12) return "Good morning";
//     if (hour < 17) return "Good afternoon";
//     return "Good evening";
//   };

//   const formatCurrency = (amount) => {
//     if (amount >= 10000000) return `₹${(amount / 10000000).toFixed(1)}Cr`;
//     if (amount >= 100000) return `₹${(amount / 100000).toFixed(1)}L`;
//     if (amount >= 1000) return `₹${(amount / 1000).toFixed(1)}K`;
//     return `₹${amount}`;
//   };

//   const formatCurrencyFull = (amount) => {
//     return new Intl.NumberFormat("en-IN", {
//       style: "currency",
//       currency: "INR",
//       maximumFractionDigits: 0,
//     }).format(amount || 0);
//   };

//   const formatTimeAgo = (date) => {
//     if (!date) return "";
//     const now = new Date();
//     const diff = now - new Date(date);
//     const mins = Math.floor(diff / 60000);
//     const hrs = Math.floor(diff / 3600000);
//     const days = Math.floor(diff / 86400000);
//     if (mins < 1) return "Just now";
//     if (mins < 60) return `${mins}m ago`;
//     if (hrs < 24) return `${hrs}h ago`;
//     if (days === 1) return "Yesterday";
//     return `${days}d ago`;
//   };

//   const handleActivityClick = (activity) => {
//     setSelectedActivity(activity);
//     setShowActivityModal(true);
//   };

//   const handleViewActivityDetail = () => {
//     if (selectedActivity) {
//       setShowActivityModal(false);
//       const routes = {
//         lead: `/leads/${selectedActivity.id}`,
//         client: `/clients/${selectedActivity.id}`,
//         project: `/projects/${selectedActivity.id}`,
//         invoice: `/invoices/${selectedActivity.id}`,
//       };
//       navigate(routes[selectedActivity.type] || "/");
//     }
//   };

//   const handleRevenueClick = () => {
//     setShowRevenueModal(true);
//   };

//   // ✅ Revenue calculated from stats (which is from completed projects)
//   const totalRevenue = stats.revenue.total;
//   const paidRevenue = stats.revenue.paid;
//   const pendingRevenue = stats.revenue.pending;

//   const activeClients =
//     stats.clients.active ||
//     data.clients.filter((c) => c.status === "active").length ||
//     data.clients.length;

//   const activeProjects =
//     stats.projects.active ||
//     data.projects.filter(
//       (p) =>
//         p.status === "in_progress" ||
//         p.status === "active" ||
//         p.status === "development" ||
//         p.status === "design" ||
//         p.status === "planning"
//     ).length;

//   const totalProjects = stats.projects.total || data.projects.length || 1;
//   const completedProjects =
//     stats.projects.completed ||
//     data.projects.filter((p) => p.status === "completed").length;
//   const pendingProjects = data.projects.filter(
//     (p) => p.status === "pending" || p.status === "on_hold"
//   ).length;

//   const inProgressPct = Math.round((activeProjects / totalProjects) * 100) || 0;
//   const completedPct =
//     Math.round((completedProjects / totalProjects) * 100) || 0;
//   const pendingPct = Math.round((pendingProjects / totalProjects) * 100) || 0;

//   // ✅ Revenue chart from completed projects (monthly)
//   const revenueChartData = (() => {
//     const monthly = Array(12).fill(0);
//     const completedProjectsList = data.projects.filter(
//       (p) => p.status === "completed"
//     );

//     completedProjectsList.forEach((project) => {
//       const completionDate = new Date(
//         project.completedDate || project.updatedAt || project.createdAt
//       );
//       const month = completionDate.getMonth();
//       monthly[month] += project.budget || 0;
//     });

//     const max = Math.max(...monthly, 1);
//     return monthly.map((v) => Math.round((v / max) * 100));
//   })();

//   const recentLeads = [...data.leads]
//     .sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt))
//     .slice(0, 4);

//   const recentProjects = data.projects
//     .filter(
//       (p) =>
//         p.status === "in_progress" ||
//         p.status === "active" ||
//         p.status === "pending" ||
//         p.status === "development" ||
//         p.status === "design" ||
//         p.status === "planning"
//     )
//     .sort(
//       (a, b) =>
//         new Date(b.updatedAt || b.createdAt) -
//         new Date(a.updatedAt || a.createdAt)
//     )
//     .slice(0, 4);

//   const activities = (() => {
//     const acts = [];

//     data.leads.slice(0, 3).forEach((l) => {
//       acts.push({
//         id: l._id,
//         type: "lead",
//         title: "New lead received",
//         description: `${l.leadName || l.name || l.company || "Unknown"} submitted a contact form`,
//         time: formatTimeAgo(l.createdAt),
//         icon: "M18 9v3m0 0v3m0-3h3m-3 0h-3m-2-5a4 4 0 11-8 0 4 4 0 018 0zM3 20a6 6 0 0112 0v1H3v-1z",
//         color: "from-purple-500 to-pink-500",
//         sortDate: l.createdAt,
//         data: l,
//       });
//     });

//     data.projects.slice(0, 3).forEach((p) => {
//       acts.push({
//         id: p._id,
//         type: "project",
//         title:
//           p.status === "completed" ? "Project completed" : "Project updated",
//         description: `${p.projectName || p.name} - ${p.progress || 0}% completed`,
//         time: formatTimeAgo(p.updatedAt || p.createdAt),
//         icon: "M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z",
//         color:
//           p.status === "completed"
//             ? "from-green-400 to-emerald-500"
//             : "from-neon-green to-neon-blue",
//         sortDate: p.updatedAt || p.createdAt,
//         data: p,
//       });
//     });

//     data.invoices.slice(0, 3).forEach((inv) => {
//       acts.push({
//         id: inv._id,
//         type: "invoice",
//         title: inv.status === "paid" ? "Invoice paid" : "Invoice created",
//         description: `${inv.client?.clientName || inv.client?.name || inv.client?.company || "Client"} - ₹${(inv.total || inv.amount || 0).toLocaleString("en-IN")}`,
//         time: formatTimeAgo(inv.updatedAt || inv.createdAt),
//         icon: "M17 9V7a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2m2 4h10a2 2 0 002-2v-6a2 2 0 00-2-2H9a2 2 0 00-2 2v6a2 2 0 002 2z",
//         color: "from-green-400 to-emerald-500",
//         sortDate: inv.updatedAt || inv.createdAt,
//         data: inv,
//       });
//     });

//     data.clients.slice(0, 3).forEach((c) => {
//       acts.push({
//         id: c._id,
//         type: "client",
//         title: "Client onboarded",
//         description: `${c.clientName || c.name || c.company || "Unknown"} completed onboarding`,
//         time: formatTimeAgo(c.createdAt),
//         icon: "M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197M13 7a4 4 0 11-8 0 4 4 0 018 0z",
//         color: "from-amber-500 to-orange-500",
//         sortDate: c.createdAt,
//         data: c,
//       });
//     });

//     return acts
//       .sort((a, b) => new Date(b.sortDate) - new Date(a.sortDate))
//       .slice(0, 5);
//   })();

//   const statCards = [
//     {
//       label: "Total Leads",
//       value: stats.leads.total.toString(),
//       change:
//         stats.leads.qualified > 0
//           ? `${stats.leads.qualified} qualified`
//           : "+12%",
//       changeType: "positive",
//       icon: "M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0z",
//       gradient: "from-purple-500 to-pink-500",
//       onClick: () => navigate("/leads"),
//     },
//     {
//       label: "Active Clients",
//       value: stats.clients.total.toString(),
//       change: activeClients > 0 ? `${activeClients} active` : "+8%",
//       changeType: "positive",
//       icon: "M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197M13 7a4 4 0 11-8 0 4 4 0 018 0z",
//       gradient: "from-neon-green to-neon-blue",
//       onClick: () => navigate("/clients"),
//     },
//     {
//       label: "Active Projects",
//       value: activeProjects.toString(),
//       change: completedProjects > 0 ? `${completedProjects} completed` : "+23%",
//       changeType: "positive",
//       icon: "M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2",
//       gradient: "from-neon-blue to-purple-500",
//       onClick: () => navigate("/projects"),
//     },
//     {
//       // ✅ Revenue from completed projects
//       label: "Total Revenue",
//       value: formatCurrency(totalRevenue),
//       change:
//         paidRevenue > 0
//           ? `${formatCurrency(paidRevenue)} received`
//           : completedProjects > 0
//             ? `${completedProjects} projects`
//             : "No completed",
//       changeType: totalRevenue > 0 ? "positive" : "neutral",
//       icon: "M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z",
//       gradient: "from-green-400 to-emerald-500",
//       onClick: handleRevenueClick,
//     },
//   ];

//   const getStatusBadge = (status) => {
//     const badges = {
//       new: "badge-purple",
//       contacted: "badge-info",
//       qualified: "badge-success",
//       proposal_sent: "badge-warning",
//       in_progress: "badge-info",
//       active: "badge-info",
//       pending: "badge-warning",
//       on_hold: "badge-warning",
//       completed: "badge-success",
//       converted: "badge-success",
//       lost: "badge-error",
//       closed_won: "badge-success",
//       closed_lost: "badge-error",
//       planning: "badge-purple",
//       design: "badge-pink",
//       development: "badge-info",
//       testing: "badge-warning",
//       review: "badge-cyan",
//     };
//     const labels = {
//       new: "New",
//       contacted: "Contacted",
//       qualified: "Qualified",
//       proposal_sent: "Proposal Sent",
//       in_progress: "In Progress",
//       active: "Active",
//       pending: "Pending",
//       on_hold: "On Hold",
//       completed: "Completed",
//       converted: "Converted",
//       lost: "Lost",
//       closed_won: "Won",
//       closed_lost: "Lost",
//       planning: "Planning",
//       design: "Design",
//       development: "Development",
//       testing: "Testing",
//       review: "Review",
//     };
//     return (
//       <span className={badges[status] || "badge-info"}>
//         {labels[status] || status}
//       </span>
//     );
//   };

//   const getStatusBadgeStyle = (status) => {
//     const styles = {
//       new: "bg-purple-500/20 text-purple-400 border-purple-500/30",
//       contacted: "bg-blue-500/20 text-blue-400 border-blue-500/30",
//       meeting: "bg-amber-500/20 text-amber-400 border-amber-500/30",
//       proposal_sent: "bg-cyan-500/20 text-cyan-400 border-cyan-500/30",
//       negotiation: "bg-orange-500/20 text-orange-400 border-orange-500/30",
//       closed_won: "bg-green-500/20 text-green-400 border-green-500/30",
//       closed_lost: "bg-red-500/20 text-red-400 border-red-500/30",
//       in_progress: "bg-blue-500/20 text-blue-400 border-blue-500/30",
//       active: "bg-green-500/20 text-green-400 border-green-500/30",
//       completed: "bg-neon-green/20 text-neon-green border-neon-green/30",
//       paid: "bg-green-500/20 text-green-400 border-green-500/30",
//       pending: "bg-amber-500/20 text-amber-400 border-amber-500/30",
//       planning: "bg-purple-500/20 text-purple-400 border-purple-500/30",
//       design: "bg-pink-500/20 text-pink-400 border-pink-500/30",
//       development: "bg-blue-500/20 text-blue-400 border-blue-500/30",
//       testing: "bg-amber-500/20 text-amber-400 border-amber-500/30",
//       review: "bg-cyan-500/20 text-cyan-400 border-cyan-500/30",
//     };
//     return styles[status] || "bg-gray-500/20 text-gray-400 border-gray-500/30";
//   };

//   if (loading) {
//     return (
//       <div className="space-y-8">
//         <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4">
//           <div>
//             <h1 className="text-3xl font-bold text-white">
//               {getGreeting()}, {user?.name?.split(" ")[0] || "Admin"}!
//             </h1>
//             <p className="text-gray-400 mt-1">Loading your dashboard...</p>
//           </div>
//         </div>
//         <div className="animate-pulse space-y-8">
//           <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
//             {[...Array(4)].map((_, i) => (
//               <div key={i} className="glass-card p-6">
//                 <div className="h-12 w-12 bg-white/10 rounded-xl mb-4" />
//                 <div className="h-4 w-24 bg-white/10 rounded mb-2" />
//                 <div className="h-8 w-16 bg-white/10 rounded" />
//               </div>
//             ))}
//           </div>
//           <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
//             <div className="lg:col-span-2 glass-card p-6">
//               <div className="h-64 bg-white/5 rounded-xl" />
//             </div>
//             <div className="glass-card p-6">
//               <div className="h-64 bg-white/5 rounded-xl" />
//             </div>
//           </div>
//         </div>
//       </div>
//     );
//   }

//   return (
//     <div className="space-y-8">
//       <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4">
//         <div>
//           <h1 className="text-3xl font-bold text-white">
//             {getGreeting()}, {user?.name?.split(" ")[0] || "Admin"}!
//           </h1>
//           <p className="text-gray-400 mt-1">
//             Here's what's happening with your agency today.
//           </p>
//         </div>
//         <div className="flex items-center gap-3">
//           <div className="hidden md:flex items-center gap-2 px-4 py-2 glass rounded-xl">
//             <div className="w-2 h-2 bg-neon-green rounded-full animate-pulse" />
//             <span className="text-sm text-gray-300">
//               {currentTime.toLocaleDateString("en-IN", {
//                 weekday: "long",
//                 year: "numeric",
//                 month: "long",
//                 day: "numeric",
//               })}
//             </span>
//           </div>
//           <button
//             onClick={handleRefresh}
//             className="btn-outline-neon flex items-center gap-2"
//           >
//             <svg
//               className="w-5 h-5"
//               fill="none"
//               stroke="currentColor"
//               viewBox="0 0 24 24"
//             >
//               <path
//                 strokeLinecap="round"
//                 strokeLinejoin="round"
//                 strokeWidth="1.5"
//                 d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15"
//               />
//             </svg>
//             Refresh
//           </button>
//         </div>
//       </div>

//       <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
//         {statCards.map((stat, index) => (
//           <StatCard key={index} {...stat} />
//         ))}
//       </div>

//       <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
//         <div className="lg:col-span-2">
//           <Card
//             title="Revenue Overview"
//             subtitle="Monthly revenue from completed projects"
//           >
//             <ChartCard
//               type="bar"
//               data={revenueChartData}
//               period={chartPeriod}
//               onPeriodChange={setChartPeriod}
//             />
//           </Card>
//         </div>

//         <Card title="Project Status" subtitle="Current distribution">
//           <div className="relative w-48 h-48 mx-auto mb-6">
//             <svg
//               className="w-full h-full transform -rotate-90"
//               viewBox="0 0 100 100"
//             >
//               <circle
//                 cx="50"
//                 cy="50"
//                 r="40"
//                 fill="none"
//                 stroke="rgba(255,255,255,0.05)"
//                 strokeWidth="12"
//               />
//               <circle
//                 cx="50"
//                 cy="50"
//                 r="40"
//                 fill="none"
//                 stroke="url(#gradient1)"
//                 strokeWidth="12"
//                 strokeDasharray={`${inProgressPct * 2.512} 251.2`}
//                 strokeLinecap="round"
//               />
//               <circle
//                 cx="50"
//                 cy="50"
//                 r="40"
//                 fill="none"
//                 stroke="url(#gradient2)"
//                 strokeWidth="12"
//                 strokeDasharray={`${completedPct * 2.512} 251.2`}
//                 strokeDashoffset={`-${inProgressPct * 2.512}`}
//                 strokeLinecap="round"
//               />
//               <circle
//                 cx="50"
//                 cy="50"
//                 r="40"
//                 fill="none"
//                 stroke="url(#gradient3)"
//                 strokeWidth="12"
//                 strokeDasharray={`${pendingPct * 2.512} 251.2`}
//                 strokeDashoffset={`-${(inProgressPct + completedPct) * 2.512}`}
//                 strokeLinecap="round"
//               />
//               <defs>
//                 <linearGradient
//                   id="gradient1"
//                   x1="0%"
//                   y1="0%"
//                   x2="100%"
//                   y2="0%"
//                 >
//                   <stop offset="0%" stopColor="#00ff88" />
//                   <stop offset="100%" stopColor="#00d4ff" />
//                 </linearGradient>
//                 <linearGradient
//                   id="gradient2"
//                   x1="0%"
//                   y1="0%"
//                   x2="100%"
//                   y2="0%"
//                 >
//                   <stop offset="0%" stopColor="#8b5cf6" />
//                   <stop offset="100%" stopColor="#ec4899" />
//                 </linearGradient>
//                 <linearGradient
//                   id="gradient3"
//                   x1="0%"
//                   y1="0%"
//                   x2="100%"
//                   y2="0%"
//                 >
//                   <stop offset="0%" stopColor="#f59e0b" />
//                   <stop offset="100%" stopColor="#ef4444" />
//                 </linearGradient>
//               </defs>
//             </svg>
//             <div className="absolute inset-0 flex items-center justify-center">
//               <div className="text-center">
//                 <p className="text-3xl font-bold text-white">
//                   {stats.projects.total || data.projects.length}
//                 </p>
//                 <p className="text-sm text-gray-400">Projects</p>
//               </div>
//             </div>
//           </div>

//           <div className="space-y-3">
//             <div className="flex items-center justify-between">
//               <div className="flex items-center gap-2">
//                 <div className="w-3 h-3 rounded-full bg-gradient-to-r from-neon-green to-neon-blue" />
//                 <span className="text-sm text-gray-300">In Progress</span>
//               </div>
//               <span className="text-sm font-medium text-white">
//                 {activeProjects} ({inProgressPct}%)
//               </span>
//             </div>
//             <div className="flex items-center justify-between">
//               <div className="flex items-center gap-2">
//                 <div className="w-3 h-3 rounded-full bg-gradient-to-r from-purple-500 to-pink-500" />
//                 <span className="text-sm text-gray-300">Completed</span>
//               </div>
//               <span className="text-sm font-medium text-white">
//                 {completedProjects} ({completedPct}%)
//               </span>
//             </div>
//             <div className="flex items-center justify-between">
//               <div className="flex items-center gap-2">
//                 <div className="w-3 h-3 rounded-full bg-gradient-to-r from-amber-500 to-red-500" />
//                 <span className="text-sm text-gray-300">Pending/On Hold</span>
//               </div>
//               <span className="text-sm font-medium text-white">
//                 {pendingProjects} ({pendingPct}%)
//               </span>
//             </div>
//           </div>
//         </Card>
//       </div>

//       <QuickActions />

//       <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
//         <Card
//           title="Recent Leads"
//           subtitle="Latest incoming leads"
//           actions={
//             <button
//               onClick={() => navigate("/leads")}
//               className="text-sm text-neon-green hover:text-neon-blue transition-colors"
//             >
//               View All ({stats.leads.total})
//             </button>
//           }
//         >
//           <div className="space-y-4">
//             {recentLeads.length === 0 ? (
//               <div className="text-center py-8">
//                 <svg
//                   className="w-12 h-12 mx-auto text-gray-600 mb-4"
//                   fill="none"
//                   stroke="currentColor"
//                   viewBox="0 0 24 24"
//                 >
//                   <path
//                     strokeLinecap="round"
//                     strokeLinejoin="round"
//                     strokeWidth="1.5"
//                     d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0z"
//                   />
//                 </svg>
//                 <p className="text-gray-400">No leads found</p>
//                 <button
//                   onClick={() => navigate("/leads/new")}
//                   className="mt-4 px-4 py-2 bg-neon-green/10 text-neon-green rounded-lg hover:bg-neon-green/20 transition-colors"
//                 >
//                   Add First Lead
//                 </button>
//               </div>
//             ) : (
//               recentLeads.map((lead, index) => (
//                 <div
//                   key={lead._id || index}
//                   onClick={() => navigate(`/leads/${lead._id}`)}
//                   className="flex items-center justify-between p-4 rounded-xl bg-white/[0.02] hover:bg-white/[0.05] border border-white/5 hover:border-neon-green/30 transition-all duration-200 cursor-pointer group"
//                 >
//                   <div className="flex items-center gap-4">
//                     <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-purple-500/20 to-pink-500/20 flex items-center justify-center border border-purple-500/20">
//                       <span className="text-sm font-medium text-purple-400">
//                         {(lead.leadName || lead.name || lead.company || "L")
//                           .charAt(0)
//                           .toUpperCase()}
//                       </span>
//                     </div>
//                     <div>
//                       <p className="text-sm font-medium text-white group-hover:text-neon-green transition-colors">
//                         {lead.leadName || lead.name || lead.company}
//                       </p>
//                       <p className="text-xs text-gray-500">{lead.email}</p>
//                     </div>
//                   </div>
//                   <div className="text-right">
//                     {getStatusBadge(lead.status)}
//                     <p className="text-xs text-gray-500 mt-1">
//                       {formatTimeAgo(lead.createdAt)}
//                     </p>
//                   </div>
//                 </div>
//               ))
//             )}
//           </div>
//         </Card>

//         <Card
//           title="Active Projects"
//           subtitle="Current project progress"
//           actions={
//             <button
//               onClick={() => navigate("/projects")}
//               className="text-sm text-neon-green hover:text-neon-blue transition-colors"
//             >
//               View All ({stats.projects.total})
//             </button>
//           }
//         >
//           <div className="space-y-4">
//             {recentProjects.length === 0 ? (
//               <div className="text-center py-8">
//                 <svg
//                   className="w-12 h-12 mx-auto text-gray-600 mb-4"
//                   fill="none"
//                   stroke="currentColor"
//                   viewBox="0 0 24 24"
//                 >
//                   <path
//                     strokeLinecap="round"
//                     strokeLinejoin="round"
//                     strokeWidth="1.5"
//                     d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2"
//                   />
//                 </svg>
//                 <p className="text-gray-400">No active projects</p>
//                 <button
//                   onClick={() => navigate("/projects/new")}
//                   className="mt-4 px-4 py-2 bg-neon-green/10 text-neon-green rounded-lg hover:bg-neon-green/20 transition-colors"
//                 >
//                   Create Project
//                 </button>
//               </div>
//             ) : (
//               recentProjects.map((project, index) => (
//                 <div
//                   key={project._id || index}
//                   onClick={() => navigate(`/projects/${project._id}`)}
//                   className="p-4 rounded-xl bg-white/[0.02] hover:bg-white/[0.05] border border-white/5 hover:border-neon-green/30 transition-all duration-200 cursor-pointer group"
//                 >
//                   <div className="flex items-center justify-between mb-3">
//                     <div>
//                       <p className="text-sm font-medium text-white group-hover:text-neon-green transition-colors">
//                         {project.projectName || project.name}
//                       </p>
//                       <p className="text-xs text-gray-500">
//                         {project.client?.clientName ||
//                           project.client?.name ||
//                           project.client?.company ||
//                           "No client"}
//                       </p>
//                     </div>
//                     {getStatusBadge(project.status)}
//                   </div>
//                   <div className="flex items-center gap-3">
//                     <div className="flex-1 h-2 bg-white/5 rounded-full overflow-hidden">
//                       <div
//                         className="h-full bg-gradient-to-r from-neon-green to-neon-blue rounded-full transition-all duration-500"
//                         style={{ width: `${project.progress || 0}%` }}
//                       />
//                     </div>
//                     <span className="text-sm font-medium text-white">
//                       {project.progress || 0}%
//                     </span>
//                   </div>
//                 </div>
//               ))
//             )}
//           </div>
//         </Card>
//       </div>

//       <RecentActivity
//         activities={activities}
//         onActivityClick={handleActivityClick}
//         onViewAll={() => navigate("/leads")}
//       />

//       <Modal
//         isOpen={showActivityModal}
//         onClose={() => setShowActivityModal(false)}
//         title="Activity Details"
//       >
//         {selectedActivity && (
//           <div className="space-y-4">
//             <div className="p-4 rounded-xl bg-white/5 border border-white/10">
//               <div className="flex items-center gap-3 mb-3">
//                 <div
//                   className={`p-2 rounded-lg bg-gradient-to-br ${selectedActivity.color}`}
//                 >
//                   <svg
//                     className="w-5 h-5 text-white"
//                     fill="none"
//                     stroke="currentColor"
//                     viewBox="0 0 24 24"
//                   >
//                     <path
//                       strokeLinecap="round"
//                       strokeLinejoin="round"
//                       strokeWidth="2"
//                       d={selectedActivity.icon}
//                     />
//                   </svg>
//                 </div>
//                 <div>
//                   <h3 className="text-white font-semibold">
//                     {selectedActivity.title}
//                   </h3>
//                   <p className="text-gray-400 text-sm">
//                     {selectedActivity.description}
//                   </p>
//                 </div>
//               </div>

//               <div className="space-y-2 text-sm">
//                 <div className="flex justify-between">
//                   <span className="text-gray-400">Created:</span>
//                   <span className="text-white">
//                     {new Date(selectedActivity.sortDate).toLocaleString(
//                       "en-IN",
//                       {
//                         day: "numeric",
//                         month: "short",
//                         year: "numeric",
//                         hour: "2-digit",
//                         minute: "2-digit",
//                       }
//                     )}
//                   </span>
//                 </div>

//                 {selectedActivity.data?.updatedAt &&
//                   selectedActivity.data.updatedAt !==
//                     selectedActivity.data.createdAt && (
//                     <div className="flex justify-between">
//                       <span className="text-gray-400">Last Updated:</span>
//                       <span className="text-white">
//                         {new Date(
//                           selectedActivity.data.updatedAt
//                         ).toLocaleString("en-IN", {
//                           day: "numeric",
//                           month: "short",
//                           year: "numeric",
//                           hour: "2-digit",
//                           minute: "2-digit",
//                         })}
//                       </span>
//                     </div>
//                   )}

//                 <div className="flex justify-between">
//                   <span className="text-gray-400">Type:</span>
//                   <span className="text-white capitalize">
//                     {selectedActivity.type}
//                   </span>
//                 </div>
//               </div>
//             </div>

//             {selectedActivity.type === "lead" && selectedActivity.data && (
//               <div className="p-4 rounded-xl bg-white/5 border border-white/10 space-y-2">
//                 <h4 className="text-white font-medium mb-2">Lead Details</h4>
//                 <div className="flex justify-between text-sm">
//                   <span className="text-gray-400">Name:</span>
//                   <span className="text-white">
//                     {selectedActivity.data.leadName ||
//                       selectedActivity.data.name}
//                   </span>
//                 </div>
//                 <div className="flex justify-between text-sm">
//                   <span className="text-gray-400">Email:</span>
//                   <span className="text-white">
//                     {selectedActivity.data.email}
//                   </span>
//                 </div>
//                 {selectedActivity.data.phone && (
//                   <div className="flex justify-between text-sm">
//                     <span className="text-gray-400">Phone:</span>
//                     <span className="text-white">
//                       {selectedActivity.data.phone}
//                     </span>
//                   </div>
//                 )}
//                 {selectedActivity.data.source && (
//                   <div className="flex justify-between text-sm">
//                     <span className="text-gray-400">Source:</span>
//                     <span className="text-white capitalize">
//                       {selectedActivity.data.source?.replace("_", " ")}
//                     </span>
//                   </div>
//                 )}
//                 <div className="flex justify-between text-sm">
//                   <span className="text-gray-400">Status:</span>
//                   <span
//                     className={`px-2 py-0.5 rounded-full text-xs font-medium border ${getStatusBadgeStyle(selectedActivity.data.status)}`}
//                   >
//                     {selectedActivity.data.status?.replace("_", " ")}
//                   </span>
//                 </div>
//                 {selectedActivity.data.city && (
//                   <div className="flex justify-between text-sm">
//                     <span className="text-gray-400">City:</span>
//                     <span className="text-white">
//                       {selectedActivity.data.city}
//                     </span>
//                   </div>
//                 )}
//                 {selectedActivity.data.estimatedValue > 0 && (
//                   <div className="flex justify-between text-sm">
//                     <span className="text-gray-400">Estimated Value:</span>
//                     <span className="text-neon-green font-semibold">
//                       {formatCurrencyFull(selectedActivity.data.estimatedValue)}
//                     </span>
//                   </div>
//                 )}
//                 {selectedActivity.data.notes && (
//                   <div className="mt-3 pt-3 border-t border-white/10">
//                     <span className="text-gray-400 text-sm">Notes:</span>
//                     <p className="text-white text-sm mt-1 whitespace-pre-wrap">
//                       {selectedActivity.data.notes}
//                     </p>
//                   </div>
//                 )}
//               </div>
//             )}

//             {selectedActivity.type === "client" && selectedActivity.data && (
//               <div className="p-4 rounded-xl bg-white/5 border border-white/10 space-y-2">
//                 <h4 className="text-white font-medium mb-2">Client Details</h4>
//                 <div className="flex justify-between text-sm">
//                   <span className="text-gray-400">Name:</span>
//                   <span className="text-white">
//                     {selectedActivity.data.clientName ||
//                       selectedActivity.data.name}
//                   </span>
//                 </div>
//                 <div className="flex justify-between text-sm">
//                   <span className="text-gray-400">Email:</span>
//                   <span className="text-white">
//                     {selectedActivity.data.email}
//                   </span>
//                 </div>
//                 {selectedActivity.data.phone && (
//                   <div className="flex justify-between text-sm">
//                     <span className="text-gray-400">Phone:</span>
//                     <span className="text-white">
//                       {selectedActivity.data.phone}
//                     </span>
//                   </div>
//                 )}
//                 {selectedActivity.data.businessName && (
//                   <div className="flex justify-between text-sm">
//                     <span className="text-gray-400">Business:</span>
//                     <span className="text-white">
//                       {selectedActivity.data.businessName}
//                     </span>
//                   </div>
//                 )}
//                 {selectedActivity.data.status && (
//                   <div className="flex justify-between text-sm">
//                     <span className="text-gray-400">Status:</span>
//                     <span className="text-white capitalize">
//                       {selectedActivity.data.status}
//                     </span>
//                   </div>
//                 )}
//               </div>
//             )}

//             {selectedActivity.type === "project" && selectedActivity.data && (
//               <div className="p-4 rounded-xl bg-white/5 border border-white/10 space-y-2">
//                 <h4 className="text-white font-medium mb-2">Project Details</h4>
//                 <div className="flex justify-between text-sm">
//                   <span className="text-gray-400">Name:</span>
//                   <span className="text-white">
//                     {selectedActivity.data.projectName ||
//                       selectedActivity.data.name}
//                   </span>
//                 </div>
//                 <div className="flex justify-between text-sm">
//                   <span className="text-gray-400">Status:</span>
//                   <span className="text-white capitalize">
//                     {selectedActivity.data.status?.replace("_", " ")}
//                   </span>
//                 </div>
//                 {selectedActivity.data.progress !== undefined && (
//                   <div className="flex justify-between text-sm">
//                     <span className="text-gray-400">Progress:</span>
//                     <span className="text-white">
//                       {selectedActivity.data.progress}%
//                     </span>
//                   </div>
//                 )}
//                 {selectedActivity.data.budget && (
//                   <div className="flex justify-between text-sm">
//                     <span className="text-gray-400">Budget:</span>
//                     <span className="text-neon-green font-semibold">
//                       {formatCurrencyFull(selectedActivity.data.budget)}
//                     </span>
//                   </div>
//                 )}
//               </div>
//             )}

//             {selectedActivity.type === "invoice" && selectedActivity.data && (
//               <div className="p-4 rounded-xl bg-white/5 border border-white/10 space-y-2">
//                 <h4 className="text-white font-medium mb-2">Invoice Details</h4>
//                 <div className="flex justify-between text-sm">
//                   <span className="text-gray-400">Invoice #:</span>
//                   <span className="text-white">
//                     {selectedActivity.data.invoiceNumber ||
//                       selectedActivity.data._id?.slice(-6)}
//                   </span>
//                 </div>
//                 <div className="flex justify-between text-sm">
//                   <span className="text-gray-400">Amount:</span>
//                   <span className="text-neon-green font-semibold">
//                     {formatCurrencyFull(
//                       selectedActivity.data.total ||
//                         selectedActivity.data.amount
//                     )}
//                   </span>
//                 </div>
//                 <div className="flex justify-between text-sm">
//                   <span className="text-gray-400">Status:</span>
//                   <span
//                     className={`px-2 py-0.5 rounded-full text-xs font-medium border ${getStatusBadgeStyle(selectedActivity.data.status)}`}
//                   >
//                     {selectedActivity.data.status}
//                   </span>
//                 </div>
//               </div>
//             )}

//             <div className="flex gap-3">
//               <button
//                 onClick={() => setShowActivityModal(false)}
//                 className="flex-1 px-4 py-2 bg-white/5 text-white rounded-xl hover:bg-white/10 transition-colors"
//               >
//                 Close
//               </button>
//               <button
//                 onClick={handleViewActivityDetail}
//                 className="flex-1 px-4 py-2 bg-neon-green text-black font-semibold rounded-xl hover:bg-neon-green/90 transition-colors"
//               >
//                 View Full Details
//               </button>
//             </div>
//           </div>
//         )}
//       </Modal>

//       {/* ✅ UPDATED: Revenue Modal with Project Details */}
//       <Modal
//         isOpen={showRevenueModal}
//         onClose={() => setShowRevenueModal(false)}
//         title="Revenue from Completed Projects"
//       >
//         <div className="space-y-4">
//           {/* Summary Cards */}
//           <div className="grid grid-cols-3 gap-4 mb-6">
//             <div className="p-4 rounded-xl bg-green-500/10 border border-green-500/30 text-center">
//               <p className="text-xs text-gray-400 uppercase">Total Budget</p>
//               <p className="text-xl font-bold text-green-400 mt-1">
//                 {formatCurrencyFull(totalRevenue)}
//               </p>
//             </div>
//             <div className="p-4 rounded-xl bg-neon-green/10 border border-neon-green/30 text-center">
//               <p className="text-xs text-gray-400 uppercase">Received</p>
//               <p className="text-xl font-bold text-neon-green mt-1">
//                 {formatCurrencyFull(paidRevenue)}
//               </p>
//             </div>
//             <div className="p-4 rounded-xl bg-amber-500/10 border border-amber-500/30 text-center">
//               <p className="text-xs text-gray-400 uppercase">Pending</p>
//               <p className="text-xl font-bold text-amber-400 mt-1">
//                 {formatCurrencyFull(pendingRevenue)}
//               </p>
//             </div>
//           </div>

//           {/* Completed Projects Count */}
//           <div className="p-4 rounded-xl bg-white/5 border border-white/10">
//             <div className="flex justify-between items-center">
//               <span className="text-gray-400">Completed Projects</span>
//               <span className="text-white font-bold text-lg">
//                 {completedProjects}
//               </span>
//             </div>
//           </div>

//           {/* Monthly Breakdown */}
//           {monthlyRevenue.length === 0 ? (
//             <div className="text-center py-8">
//               <svg
//                 className="w-12 h-12 mx-auto text-gray-600 mb-4"
//                 fill="none"
//                 stroke="currentColor"
//                 viewBox="0 0 24 24"
//               >
//                 <path
//                   strokeLinecap="round"
//                   strokeLinejoin="round"
//                   strokeWidth="1.5"
//                   d="M9 14l6-6m-5.5.5h.01m4.99 5h.01M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16l3.5-2 3.5 2 3.5-2 3.5 2z"
//                 />
//               </svg>
//               <p className="text-gray-400">No monthly revenue data available</p>
//               <p className="text-gray-500 text-sm mt-2">
//                 Complete projects to see revenue breakdown
//               </p>
//             </div>
//           ) : (
//             <div className="space-y-3 max-h-80 overflow-y-auto">
//               <h4 className="text-white font-medium">Monthly Breakdown</h4>
//               {monthlyRevenue.map((month, index) => (
//                 <div
//                   key={index}
//                   className="p-4 rounded-xl bg-white/5 border border-white/10 hover:border-neon-green/30 transition-colors"
//                 >
//                   <div className="flex justify-between items-center mb-2">
//                     <h4 className="text-white font-semibold">
//                       {month.month} {month.year}
//                     </h4>
//                     <span className="text-neon-green font-bold">
//                       {formatCurrencyFull(month.total)}
//                     </span>
//                   </div>
//                   <div className="grid grid-cols-3 gap-4 text-sm">
//                     <div>
//                       <span className="text-gray-400">Projects:</span>
//                       <span className="text-white ml-2">
//                         {month.projectCount}
//                       </span>
//                     </div>
//                     <div>
//                       <span className="text-gray-400">Received:</span>
//                       <span className="text-neon-green ml-2">
//                         {formatCurrency(month.paid)}
//                       </span>
//                     </div>
//                     <div>
//                       <span className="text-gray-400">Pending:</span>
//                       <span className="text-amber-400 ml-2">
//                         {formatCurrency(month.pending)}
//                       </span>
//                     </div>
//                   </div>

//                   {/* Project Details */}
//                   {month.projects && month.projects.length > 0 && (
//                     <div className="mt-3 pt-3 border-t border-white/10">
//                       <p className="text-xs text-gray-500 mb-2">Projects:</p>
//                       <div className="space-y-1">
//                         {month.projects.map((proj, pIdx) => (
//                           <div
//                             key={pIdx}
//                             className="flex justify-between text-xs"
//                           >
//                             <span className="text-gray-300 truncate max-w-[60%]">
//                               {proj.name}
//                             </span>
//                             <span className="text-neon-green">
//                               {formatCurrency(proj.budget)}
//                             </span>
//                           </div>
//                         ))}
//                       </div>
//                     </div>
//                   )}
//                 </div>
//               ))}
//             </div>
//           )}

//           {/* Completed Projects List */}
//           {data.projects.filter((p) => p.status === "completed").length > 0 && (
//             <div className="space-y-3">
//               <h4 className="text-white font-medium">All Completed Projects</h4>
//               <div className="max-h-60 overflow-y-auto space-y-2">
//                 {data.projects
//                   .filter((p) => p.status === "completed")
//                   .sort(
//                     (a, b) =>
//                       new Date(b.completedDate || b.updatedAt) -
//                       new Date(a.completedDate || a.updatedAt)
//                   )
//                   .map((project) => (
//                     <div
//                       key={project._id}
//                       onClick={() => {
//                         setShowRevenueModal(false);
//                         navigate(`/projects/${project._id}`);
//                       }}
//                       className="p-3 rounded-xl bg-white/5 border border-white/10 hover:border-neon-green/30 transition-colors cursor-pointer"
//                     >
//                       <div className="flex justify-between items-start">
//                         <div>
//                           <p className="text-white font-medium text-sm">
//                             {project.projectName || project.name}
//                           </p>
//                           <p className="text-xs text-gray-500">
//                             {project.client?.businessName ||
//                               project.client?.clientName ||
//                               "No client"}
//                           </p>
//                         </div>
//                         <div className="text-right">
//                           <p className="text-neon-green font-semibold text-sm">
//                             {formatCurrencyFull(project.budget)}
//                           </p>
//                           <p className="text-xs text-gray-500">
//                             Paid: {formatCurrency(project.amountPaid || 0)}
//                           </p>
//                         </div>
//                       </div>
//                       {/* Payment Progress */}
//                       <div className="mt-2">
//                         <div className="h-1.5 bg-white/10 rounded-full overflow-hidden">
//                           <div
//                             className="h-full bg-gradient-to-r from-neon-green to-neon-blue rounded-full"
//                             style={{
//                               width: `${Math.min(((project.amountPaid || 0) / (project.budget || 1)) * 100, 100)}%`,
//                             }}
//                           />
//                         </div>
//                         <div className="flex justify-between mt-1 text-xs text-gray-500">
//                           <span>
//                             {Math.round(
//                               ((project.amountPaid || 0) /
//                                 (project.budget || 1)) *
//                                 100
//                             )}
//                             % paid
//                           </span>
//                           <span>
//                             Balance:{" "}
//                             {formatCurrency(
//                               (project.budget || 0) - (project.amountPaid || 0)
//                             )}
//                           </span>
//                         </div>
//                       </div>
//                     </div>
//                   ))}
//               </div>
//             </div>
//           )}

//           <button
//             onClick={() => {
//               setShowRevenueModal(false);
//               navigate("/projects?status=completed");
//             }}
//             className="w-full px-4 py-2 bg-neon-green/10 text-neon-green rounded-xl hover:bg-neon-green/20 transition-colors"
//           >
//             View All Completed Projects
//           </button>
//         </div>
//       </Modal>
//     </div>
//   );
// };

// export default Dashboard;

import React, { useState, useEffect, useRef } from "react";
import { useNavigate } from "react-router-dom";
import StatCard from "../../components/dashboard/StatCard";
import RecentActivity from "../../components/dashboard/RecentActivity";
import QuickActions from "../../components/dashboard/QuickActions";
import Card from "../../components/common/Card";
import Modal from "../../components/common/Modal";
import useAuth from "../../hooks/useAuth";
import api from "../../services/api";
import leadService from "../../services/leadService";
import clientService from "../../services/clientService";
import projectService from "../../services/projectService";
import invoiceService from "../../services/invoiceService";

const Dashboard = () => {
  const navigate = useNavigate();
  const { user } = useAuth();
  const [chartPeriod, setChartPeriod] = useState("year");
  const [currentTime, setCurrentTime] = useState(new Date());
  const [loading, setLoading] = useState(true);
  const [data, setData] = useState({
    leads: [],
    clients: [],
    projects: [],
    invoices: [],
  });
  const [stats, setStats] = useState({
    leads: {
      total: 0,
      qualified: 0,
      conversionRate: 0,
      totalValue: 0,
      sourceCounts: {},
      statusCounts: {},
    },
    clients: { total: 0, active: 0 },
    projects: { total: 0, active: 0, completed: 0 },
    revenue: { total: 0, paid: 0, pending: 0 },
  });
  const [revenueData, setRevenueData] = useState({
    monthly: [],
    yearly: [],
    projects: [],
  });
  const [selectedActivity, setSelectedActivity] = useState(null);
  const [showActivityModal, setShowActivityModal] = useState(false);
  const [showRevenueModal, setShowRevenueModal] = useState(false);
  const [showChartModal, setShowChartModal] = useState(false);
  const [selectedChartData, setSelectedChartData] = useState(null);
  const fetchedRef = useRef(false);

  useEffect(() => {
    const timer = setInterval(() => setCurrentTime(new Date()), 60000);
    return () => clearInterval(timer);
  }, []);

  useEffect(() => {
    if (!fetchedRef.current) {
      fetchedRef.current = true;
      fetchDashboardData();
    }
  }, []);

  const fetchDashboardData = async () => {
    setLoading(true);
    try {
      const [dataResults, statsResults] = await Promise.all([
        Promise.allSettled([
          api.get("/leads?limit=100"),
          api.get("/clients?limit=100"),
          api.get("/projects?limit=100"),
          api.get("/invoices?limit=100"),
        ]),
        Promise.allSettled([
          leadService.getLeadStats(),
          clientService.getClientStats(),
          projectService.getProjectStats(),
          invoiceService.getInvoiceStats(),
        ]),
      ]);

      const extractData = (result) => {
        if (result.status === "fulfilled") {
          const d = result.value.data.data || result.value.data;
          return Array.isArray(d) ? d : [];
        }
        return [];
      };

      const extractStats = (result, defaultVal = {}) => {
        if (result.status === "fulfilled") {
          return result.value.data || defaultVal;
        }
        return defaultVal;
      };

      const leadsData = extractData(dataResults[0]);
      const clientsData = extractData(dataResults[1]);
      const projectsData = extractData(dataResults[2]);
      const invoicesData = extractData(dataResults[3]);

      setData({
        leads: leadsData,
        clients: clientsData,
        projects: projectsData,
        invoices: invoicesData,
      });

      const leadStats = extractStats(statsResults[0], {});
      const clientStats = extractStats(statsResults[1], {});
      const projectStats = extractStats(statsResults[2], {});
      const invoiceStats = extractStats(statsResults[3], {});

      // Calculate revenue from COMPLETED projects
      const completedProjects = projectsData.filter(
        (p) => p.status === "completed"
      );
      const totalRevenueFromProjects = completedProjects.reduce(
        (sum, p) => sum + (p.budget || 0),
        0
      );
      const paidAmountFromProjects = completedProjects.reduce(
        (sum, p) => sum + (p.amountPaid || 0),
        0
      );
      const pendingAmountFromProjects =
        totalRevenueFromProjects - paidAmountFromProjects;

      // Calculate monthly and yearly revenue data
      const revenueCalc = calculateRevenueData(completedProjects);
      setRevenueData(revenueCalc);

      setStats({
        leads: {
          total: leadStats.totalLeads || leadsData.length || 0,
          qualified: leadStats.statusCounts?.contacted || 0,
          conversionRate: leadStats.conversionRate || 0,
          totalValue: leadStats.totalValue || 0,
          sourceCounts: leadStats.sourceCounts || {},
          statusCounts: leadStats.statusCounts || {},
        },
        clients: {
          total: clientStats.totalClients || clientsData.length || 0,
          active: clientStats.activeClients || 0,
        },
        projects: {
          total: projectStats.totalProjects || projectsData.length || 0,
          active: projectStats.activeProjects || 0,
          completed:
            projectStats.completedProjects || completedProjects.length || 0,
        },
        revenue: {
          total: totalRevenueFromProjects,
          paid: paidAmountFromProjects,
          pending: pendingAmountFromProjects,
        },
      });
    } catch (error) {
      console.error("Failed to fetch dashboard data:", error);
    } finally {
      setLoading(false);
    }
  };

  // Calculate monthly and yearly revenue from completed projects
  const calculateRevenueData = (completedProjects) => {
    const months = [
      "January",
      "February",
      "March",
      "April",
      "May",
      "June",
      "July",
      "August",
      "September",
      "October",
      "November",
      "December",
    ];
    const currentYear = new Date().getFullYear();

    // Initialize monthly data for current year
    const monthlyData = months.map((month, index) => ({
      month,
      shortMonth: month.substring(0, 3),
      monthIndex: index,
      year: currentYear,
      total: 0,
      paid: 0,
      pending: 0,
      projectCount: 0,
      projects: [],
    }));

    // Initialize yearly data
    const yearlyMap = {};

    completedProjects.forEach((project) => {
      const completionDate = new Date(
        project.completedDate || project.updatedAt || project.createdAt
      );
      const year = completionDate.getFullYear();
      const monthIndex = completionDate.getMonth();

      const projectData = {
        id: project._id,
        name: project.projectName || project.name,
        budget: project.budget || 0,
        amountPaid: project.amountPaid || 0,
        client:
          project.client?.businessName ||
          project.client?.clientName ||
          "No client",
        completedDate: completionDate,
        status: project.status,
      };

      // Add to monthly data if current year
      if (year === currentYear) {
        monthlyData[monthIndex].total += project.budget || 0;
        monthlyData[monthIndex].paid += project.amountPaid || 0;
        monthlyData[monthIndex].pending +=
          (project.budget || 0) - (project.amountPaid || 0);
        monthlyData[monthIndex].projectCount += 1;
        monthlyData[monthIndex].projects.push(projectData);
      }

      // Add to yearly data
      if (!yearlyMap[year]) {
        yearlyMap[year] = {
          year,
          label: year.toString(),
          total: 0,
          paid: 0,
          pending: 0,
          projectCount: 0,
          projects: [],
        };
      }
      yearlyMap[year].total += project.budget || 0;
      yearlyMap[year].paid += project.amountPaid || 0;
      yearlyMap[year].pending +=
        (project.budget || 0) - (project.amountPaid || 0);
      yearlyMap[year].projectCount += 1;
      yearlyMap[year].projects.push(projectData);
    });

    // Convert yearly map to sorted array
    const yearlyData = Object.values(yearlyMap).sort((a, b) => a.year - b.year);

    return {
      monthly: monthlyData,
      yearly: yearlyData,
      projects: completedProjects,
    };
  };

  // Get chart data based on selected period
  const getChartData = () => {
    if (
      chartPeriod === "all" &&
      revenueData.yearly &&
      revenueData.yearly.length > 0
    ) {
      return revenueData.yearly;
    } else if (chartPeriod === "6months") {
      const currentMonth = new Date().getMonth();
      const last6Months = [];
      for (let i = 5; i >= 0; i--) {
        const monthIndex = (currentMonth - i + 12) % 12;
        last6Months.push(
          revenueData.monthly[monthIndex] || {
            month: "",
            shortMonth: "",
            monthIndex,
            total: 0,
            paid: 0,
            pending: 0,
            projectCount: 0,
            projects: [],
          }
        );
      }
      return last6Months;
    }
    return revenueData.monthly || [];
  };

  // Generate ALL activities including status changes
  const generateActivities = () => {
    const acts = [];

    const formatTimeAgo = (date) => {
      if (!date) return "";
      const now = new Date();
      const diff = now - new Date(date);
      const mins = Math.floor(diff / 60000);
      const hrs = Math.floor(diff / 3600000);
      const days = Math.floor(diff / 86400000);
      if (mins < 1) return "Just now";
      if (mins < 60) return `${mins}m ago`;
      if (hrs < 24) return `${hrs}h ago`;
      if (days === 1) return "Yesterday";
      if (days < 7) return `${days}d ago`;
      return `${Math.floor(days / 7)}w ago`;
    };

    // Leads
    data.leads.forEach((lead) => {
      const isConverted =
        lead.status === "converted" || lead.status === "closed_won";
      const isLost = lead.status === "lost" || lead.status === "closed_lost";

      acts.push({
        id: lead._id,
        type: "lead",
        action: isConverted
          ? "converted"
          : isLost
            ? "lost"
            : lead.status === "new"
              ? "new"
              : "status",
        title: isConverted
          ? "Lead converted to client"
          : isLost
            ? "Lead marked as lost"
            : lead.status === "new"
              ? "New lead received"
              : `Lead: ${lead.status?.replace("_", " ")}`,
        description: `${lead.leadName || lead.name || lead.company || "Unknown"} - ${lead.email || "No email"}`,
        time: formatTimeAgo(lead.updatedAt || lead.createdAt),
        sortDate: new Date(lead.updatedAt || lead.createdAt),
        data: lead,
        icon: isConverted
          ? "M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z"
          : "M18 9v3m0 0v3m0-3h3m-3 0h-3m-2-5a4 4 0 11-8 0 4 4 0 018 0zM3 20a6 6 0 0112 0v1H3v-1z",
        color: isConverted
          ? "from-green-400 to-emerald-500"
          : isLost
            ? "from-red-500 to-red-600"
            : "from-purple-500 to-pink-500",
        statusChange:
          lead.status !== "new" ? { from: "new", to: lead.status } : null,
      });
    });

    // Clients
    data.clients.forEach((client) => {
      acts.push({
        id: client._id,
        type: "client",
        action: "new",
        title: "New client onboarded",
        description: `${client.clientName || client.name || "Unknown"} - ${client.businessName || client.email || ""}`,
        time: formatTimeAgo(client.createdAt),
        sortDate: new Date(client.createdAt),
        data: client,
        icon: "M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197M13 7a4 4 0 11-8 0 4 4 0 018 0z",
        color: "from-amber-500 to-orange-500",
      });
    });

    // Projects
    data.projects.forEach((project) => {
      const isCompleted = project.status === "completed";
      const statusColors = {
        planning: "from-purple-500 to-pink-500",
        design: "from-pink-500 to-rose-500",
        development: "from-blue-500 to-cyan-500",
        testing: "from-amber-500 to-orange-500",
        review: "from-cyan-500 to-teal-500",
        completed: "from-green-400 to-emerald-500",
        on_hold: "from-gray-500 to-gray-600",
        cancelled: "from-red-500 to-red-600",
      };

      acts.push({
        id: project._id,
        type: "project",
        action: isCompleted ? "completed" : project.status,
        title: isCompleted
          ? "Project completed"
          : project.status === "planning"
            ? "New project created"
            : `Project: ${project.status?.replace("_", " ")}`,
        description: `${project.projectName || project.name} - ${project.progress || 0}% complete`,
        time: formatTimeAgo(project.updatedAt || project.createdAt),
        sortDate: new Date(project.updatedAt || project.createdAt),
        data: project,
        icon: isCompleted
          ? "M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"
          : "M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2",
        color: statusColors[project.status] || "from-neon-green to-neon-blue",
        statusChange:
          project.status !== "planning"
            ? { from: "planning", to: project.status }
            : null,
      });
    });

    // Invoices
    data.invoices.forEach((invoice) => {
      const isPaid = invoice.status === "paid";
      const isOverdue = invoice.status === "overdue";

      acts.push({
        id: invoice._id,
        type: "invoice",
        action: isPaid ? "paid" : isOverdue ? "overdue" : invoice.status,
        title: isPaid
          ? "Invoice paid"
          : isOverdue
            ? "Invoice overdue"
            : invoice.status === "sent"
              ? "Invoice sent"
              : "Invoice created",
        description: `${invoice.client?.clientName || invoice.client?.businessName || "Client"} - ₹${(invoice.total || 0).toLocaleString("en-IN")}`,
        time: formatTimeAgo(invoice.updatedAt || invoice.createdAt),
        sortDate: new Date(invoice.updatedAt || invoice.createdAt),
        data: invoice,
        icon: isPaid
          ? "M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"
          : "M17 9V7a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2m2 4h10a2 2 0 002-2v-6a2 2 0 00-2-2H9a2 2 0 00-2 2v6a2 2 0 002 2z",
        color: isPaid
          ? "from-green-400 to-emerald-500"
          : isOverdue
            ? "from-red-500 to-red-600"
            : "from-cyan-500 to-blue-500",
      });
    });

    // Sort by date (newest first) and limit
    return acts.sort((a, b) => b.sortDate - a.sortDate).slice(0, 15);
  };

  const activities = generateActivities();

  const handleRefresh = () => {
    fetchedRef.current = false;
    fetchDashboardData();
  };

  const getGreeting = () => {
    const hour = currentTime.getHours();
    if (hour < 12) return "Good morning";
    if (hour < 17) return "Good afternoon";
    return "Good evening";
  };

  const formatCurrency = (amount) => {
    if (amount >= 10000000) return `₹${(amount / 10000000).toFixed(1)}Cr`;
    if (amount >= 100000) return `₹${(amount / 100000).toFixed(1)}L`;
    if (amount >= 1000) return `₹${(amount / 1000).toFixed(1)}K`;
    return `₹${amount}`;
  };

  const formatCurrencyFull = (amount) => {
    return new Intl.NumberFormat("en-IN", {
      style: "currency",
      currency: "INR",
      maximumFractionDigits: 0,
    }).format(amount || 0);
  };

  const formatTimeAgo = (date) => {
    if (!date) return "";
    const now = new Date();
    const diff = now - new Date(date);
    const mins = Math.floor(diff / 60000);
    const hrs = Math.floor(diff / 3600000);
    const days = Math.floor(diff / 86400000);
    if (mins < 1) return "Just now";
    if (mins < 60) return `${mins}m ago`;
    if (hrs < 24) return `${hrs}h ago`;
    if (days === 1) return "Yesterday";
    return `${days}d ago`;
  };

  const handleActivityClick = (activity) => {
    setSelectedActivity(activity);
    setShowActivityModal(true);
  };

  const handleViewActivityDetail = () => {
    if (selectedActivity) {
      setShowActivityModal(false);
      const routes = {
        lead: `/leads/${selectedActivity.id}`,
        client: `/clients/${selectedActivity.id}`,
        project: `/projects/${selectedActivity.id}`,
        invoice: `/invoices/${selectedActivity.id}`,
        proposal: `/proposals/${selectedActivity.id}`,
        agreement: `/agreements/${selectedActivity.id}`,
      };
      navigate(routes[selectedActivity.type] || "/");
    }
  };

  const handleRevenueClick = () => {
    setShowRevenueModal(true);
  };

  const handleBarClick = (item, index) => {
    setSelectedChartData({
      ...item,
      index,
      label:
        chartPeriod === "all"
          ? item.year || item.label
          : item.shortMonth || item.month,
    });
    setShowChartModal(true);
  };

  // Stats calculations
  const totalRevenue = stats.revenue.total;
  const paidRevenue = stats.revenue.paid;
  const pendingRevenue = stats.revenue.pending;

  const activeClients =
    stats.clients.active ||
    data.clients.filter((c) => c.status === "active").length ||
    data.clients.length;

  const activeProjects =
    stats.projects.active ||
    data.projects.filter(
      (p) =>
        p.status === "in_progress" ||
        p.status === "active" ||
        p.status === "development" ||
        p.status === "design" ||
        p.status === "planning" ||
        p.status === "testing" ||
        p.status === "review"
    ).length;

  const totalProjects = stats.projects.total || data.projects.length || 1;
  const completedProjects =
    stats.projects.completed ||
    data.projects.filter((p) => p.status === "completed").length;
  const pendingProjects = data.projects.filter(
    (p) => p.status === "pending" || p.status === "on_hold"
  ).length;

  const inProgressPct = Math.round((activeProjects / totalProjects) * 100) || 0;
  const completedPct =
    Math.round((completedProjects / totalProjects) * 100) || 0;
  const pendingPct = Math.round((pendingProjects / totalProjects) * 100) || 0;

  // Chart data
  const chartData = getChartData();
  const chartMaxValue = Math.max(...chartData.map((d) => d.total || 0), 1);
  const chartTotalRevenue = chartData.reduce(
    (sum, d) => sum + (d.total || 0),
    0
  );
  const chartTotalPaid = chartData.reduce((sum, d) => sum + (d.paid || 0), 0);
  const chartTotalProjects = chartData.reduce(
    (sum, d) => sum + (d.projectCount || 0),
    0
  );

  // Recent data
  const recentLeads = [...data.leads]
    .sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt))
    .slice(0, 4);

  const recentProjects = data.projects
    .filter(
      (p) =>
        p.status === "in_progress" ||
        p.status === "active" ||
        p.status === "pending" ||
        p.status === "development" ||
        p.status === "design" ||
        p.status === "planning" ||
        p.status === "testing" ||
        p.status === "review"
    )
    .sort(
      (a, b) =>
        new Date(b.updatedAt || b.createdAt) -
        new Date(a.updatedAt || a.createdAt)
    )
    .slice(0, 4);

  const statCards = [
    {
      label: "Total Leads",
      value: stats.leads.total.toString(),
      change:
        stats.leads.qualified > 0
          ? `${stats.leads.qualified} qualified`
          : "+12%",
      changeType: "positive",
      icon: "M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0z",
      gradient: "from-purple-500 to-pink-500",
      onClick: () => navigate("/leads"),
    },
    {
      label: "Active Clients",
      value: stats.clients.total.toString(),
      change: activeClients > 0 ? `${activeClients} active` : "+8%",
      changeType: "positive",
      icon: "M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197M13 7a4 4 0 11-8 0 4 4 0 018 0z",
      gradient: "from-neon-green to-neon-blue",
      onClick: () => navigate("/clients"),
    },
    {
      label: "Active Projects",
      value: activeProjects.toString(),
      change: completedProjects > 0 ? `${completedProjects} completed` : "+23%",
      changeType: "positive",
      icon: "M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2",
      gradient: "from-neon-blue to-purple-500",
      onClick: () => navigate("/projects"),
    },
    {
      label: "Total Revenue",
      value: formatCurrency(totalRevenue),
      change:
        paidRevenue > 0
          ? `${formatCurrency(paidRevenue)} received`
          : completedProjects > 0
            ? `${completedProjects} projects`
            : "No completed",
      changeType: totalRevenue > 0 ? "positive" : "neutral",
      icon: "M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z",
      gradient: "from-green-400 to-emerald-500",
      onClick: handleRevenueClick,
    },
  ];

  const getStatusBadge = (status) => {
    const badges = {
      new: "badge-purple",
      contacted: "badge-info",
      qualified: "badge-success",
      proposal_sent: "badge-warning",
      in_progress: "badge-info",
      active: "badge-info",
      pending: "badge-warning",
      on_hold: "badge-warning",
      completed: "badge-success",
      converted: "badge-success",
      lost: "badge-error",
      closed_won: "badge-success",
      closed_lost: "badge-error",
      planning: "badge-purple",
      design: "badge-pink",
      development: "badge-info",
      testing: "badge-warning",
      review: "badge-cyan",
    };
    const labels = {
      new: "New",
      contacted: "Contacted",
      qualified: "Qualified",
      proposal_sent: "Proposal Sent",
      in_progress: "In Progress",
      active: "Active",
      pending: "Pending",
      on_hold: "On Hold",
      completed: "Completed",
      converted: "Converted",
      lost: "Lost",
      closed_won: "Won",
      closed_lost: "Lost",
      planning: "Planning",
      design: "Design",
      development: "Development",
      testing: "Testing",
      review: "Review",
    };
    return (
      <span className={badges[status] || "badge-info"}>
        {labels[status] || status}
      </span>
    );
  };

  const getStatusBadgeStyle = (status) => {
    const styles = {
      new: "bg-purple-500/20 text-purple-400 border-purple-500/30",
      contacted: "bg-blue-500/20 text-blue-400 border-blue-500/30",
      meeting: "bg-amber-500/20 text-amber-400 border-amber-500/30",
      proposal_sent: "bg-cyan-500/20 text-cyan-400 border-cyan-500/30",
      negotiation: "bg-orange-500/20 text-orange-400 border-orange-500/30",
      closed_won: "bg-green-500/20 text-green-400 border-green-500/30",
      closed_lost: "bg-red-500/20 text-red-400 border-red-500/30",
      in_progress: "bg-blue-500/20 text-blue-400 border-blue-500/30",
      active: "bg-green-500/20 text-green-400 border-green-500/30",
      completed: "bg-neon-green/20 text-neon-green border-neon-green/30",
      paid: "bg-green-500/20 text-green-400 border-green-500/30",
      pending: "bg-amber-500/20 text-amber-400 border-amber-500/30",
      planning: "bg-purple-500/20 text-purple-400 border-purple-500/30",
      design: "bg-pink-500/20 text-pink-400 border-pink-500/30",
      development: "bg-blue-500/20 text-blue-400 border-blue-500/30",
      testing: "bg-amber-500/20 text-amber-400 border-amber-500/30",
      review: "bg-cyan-500/20 text-cyan-400 border-cyan-500/30",
      converted: "bg-green-500/20 text-green-400 border-green-500/30",
      lost: "bg-red-500/20 text-red-400 border-red-500/30",
    };
    return styles[status] || "bg-gray-500/20 text-gray-400 border-gray-500/30";
  };

  if (loading) {
    return (
      <div className="space-y-8">
        <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4">
          <div>
            <h1 className="text-3xl font-bold text-white">
              {getGreeting()}, {user?.name?.split(" ")[0] || "Admin"}!
            </h1>
            <p className="text-gray-400 mt-1">Loading your dashboard...</p>
          </div>
        </div>
        <div className="animate-pulse space-y-8">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {[...Array(4)].map((_, i) => (
              <div key={i} className="glass-card p-6">
                <div className="h-12 w-12 bg-white/10 rounded-xl mb-4" />
                <div className="h-4 w-24 bg-white/10 rounded mb-2" />
                <div className="h-8 w-16 bg-white/10 rounded" />
              </div>
            ))}
          </div>
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            <div className="lg:col-span-2 glass-card p-6">
              <div className="h-64 bg-white/5 rounded-xl" />
            </div>
            <div className="glass-card p-6">
              <div className="h-64 bg-white/5 rounded-xl" />
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold text-white">
            {getGreeting()}, {user?.name?.split(" ")[0] || "Admin"}!
          </h1>
          <p className="text-gray-400 mt-1">
            Here's what's happening with your agency today.
          </p>
        </div>
        <div className="flex items-center gap-3">
          <div className="hidden md:flex items-center gap-2 px-4 py-2 glass rounded-xl">
            <div className="w-2 h-2 bg-neon-green rounded-full animate-pulse" />
            <span className="text-sm text-gray-300">
              {currentTime.toLocaleDateString("en-IN", {
                weekday: "long",
                year: "numeric",
                month: "long",
                day: "numeric",
              })}
            </span>
          </div>
          <button
            onClick={handleRefresh}
            className="btn-outline-neon flex items-center gap-2"
          >
            <svg
              className="w-5 h-5"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth="1.5"
                d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15"
              />
            </svg>
            Refresh
          </button>
        </div>
      </div>

      {/* Stat Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {statCards.map((stat, index) => (
          <StatCard key={index} {...stat} />
        ))}
      </div>

      {/* Charts Section */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Revenue Chart */}
        <div className="lg:col-span-2">
          <Card>
            {/* Chart Header */}
            <div className="flex items-center justify-between mb-4">
              <div>
                <h3 className="text-lg font-semibold text-white">
                  Revenue Overview
                </h3>
                <p className="text-sm text-gray-400">
                  Revenue from completed projects
                </p>
              </div>
              <select
                value={chartPeriod}
                onChange={(e) => setChartPeriod(e.target.value)}
                className="px-4 py-2 bg-white/5 border border-white/10 rounded-xl text-sm text-white focus:outline-none focus:border-neon-green/50 cursor-pointer"
              >
                <option value="6months">Last 6 Months</option>
                <option value="year">
                  This Year ({new Date().getFullYear()})
                </option>
                <option value="all">All Time</option>
              </select>
            </div>

            {/* Summary Stats */}
            <div className="grid grid-cols-3 gap-3 mb-6">
              <div className="p-3 rounded-xl bg-white/5 border border-white/10 text-center">
                <p className="text-xs text-gray-400">Total Revenue</p>
                <p className="text-lg font-bold text-neon-green">
                  {formatCurrency(chartTotalRevenue)}
                </p>
              </div>
              <div className="p-3 rounded-xl bg-white/5 border border-white/10 text-center">
                <p className="text-xs text-gray-400">Received</p>
                <p className="text-lg font-bold text-green-400">
                  {formatCurrency(chartTotalPaid)}
                </p>
              </div>
              <div className="p-3 rounded-xl bg-white/5 border border-white/10 text-center">
                <p className="text-xs text-gray-400">Projects</p>
                <p className="text-lg font-bold text-white">
                  {chartTotalProjects}
                </p>
              </div>
            </div>

            {/* Bar Chart */}
            {chartData.length === 0 ||
            chartData.every((d) => (d.total || 0) === 0) ? (
              <div className="h-64 flex items-center justify-center">
                <div className="text-center">
                  <svg
                    className="w-12 h-12 mx-auto text-gray-600 mb-4"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth="1.5"
                      d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z"
                    />
                  </svg>
                  <p className="text-gray-400">No revenue data available</p>
                  <p className="text-gray-500 text-sm mt-1">
                    Complete projects to see revenue
                  </p>
                </div>
              </div>
            ) : (
              <div className="h-64 flex items-end justify-between gap-1 sm:gap-2 px-2">
                {chartData.map((item, i) => {
                  const value = item.total || 0;
                  const height =
                    chartMaxValue > 0 ? (value / chartMaxValue) * 100 : 0;
                  const hasData = value > 0;

                  return (
                    <div
                      key={i}
                      className="flex-1 flex flex-col items-center gap-2 group cursor-pointer"
                      onClick={() => handleBarClick(item, i)}
                    >
                      <div className="relative w-full flex justify-center">
                        {/* Bar */}
                        <div
                          className={`w-full max-w-[40px] rounded-t-lg transition-all duration-300 ${
                            hasData
                              ? "bg-gradient-to-t from-neon-green/60 to-neon-blue/60 hover:from-neon-green hover:to-neon-blue group-hover:shadow-[0_0_20px_rgba(0,255,136,0.4)]"
                              : "bg-white/10 hover:bg-white/20"
                          }`}
                          style={{ height: `${Math.max(height * 2, 8)}px` }}
                        />

                        {/* Tooltip on hover */}
                        <div className="absolute -top-20 left-1/2 -translate-x-1/2 px-3 py-2 bg-dark-600 border border-white/10 rounded-lg text-xs text-white opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap z-10 pointer-events-none">
                          <p className="font-semibold text-neon-green">
                            {formatCurrency(value)}
                          </p>
                          <p className="text-gray-400">
                            {item.projectCount || 0} projects
                          </p>
                          {item.paid > 0 && (
                            <p className="text-green-400">
                              Paid: {formatCurrency(item.paid)}
                            </p>
                          )}
                          <p className="text-gray-500 mt-1 text-[10px]">
                            Click for details
                          </p>
                        </div>

                        {/* Click indicator */}
                        {hasData && (
                          <div className="absolute -top-2 left-1/2 -translate-x-1/2 w-2 h-2 bg-neon-green rounded-full opacity-0 group-hover:opacity-100 transition-opacity animate-pulse" />
                        )}
                      </div>

                      {/* Label */}
                      <span className="text-xs text-gray-500 group-hover:text-white transition-colors">
                        {chartPeriod === "all"
                          ? item.year || item.label
                          : chartPeriod === "6months"
                            ? item.shortMonth || item.month?.substring(0, 1)
                            : item.month?.substring(0, 1) || ""}
                      </span>
                    </div>
                  );
                })}
              </div>
            )}

            {/* Legend */}
            <div className="flex items-center justify-center gap-6 mt-4 pt-4 border-t border-white/5">
              <div className="flex items-center gap-2">
                <div className="w-3 h-3 rounded-full bg-gradient-to-r from-neon-green to-neon-blue" />
                <span className="text-xs text-gray-400">Revenue</span>
              </div>
              <div className="flex items-center gap-2">
                <div className="w-3 h-3 rounded-full bg-green-500" />
                <span className="text-xs text-gray-400">Received</span>
              </div>
              <p className="text-xs text-gray-500">Click bar for details</p>
            </div>
          </Card>
        </div>

        {/* Project Status */}
        <Card title="Project Status" subtitle="Current distribution">
          <div className="relative w-48 h-48 mx-auto mb-6">
            <svg
              className="w-full h-full transform -rotate-90"
              viewBox="0 0 100 100"
            >
              <circle
                cx="50"
                cy="50"
                r="40"
                fill="none"
                stroke="rgba(255,255,255,0.05)"
                strokeWidth="12"
              />
              <circle
                cx="50"
                cy="50"
                r="40"
                fill="none"
                stroke="url(#gradient1)"
                strokeWidth="12"
                strokeDasharray={`${inProgressPct * 2.512} 251.2`}
                strokeLinecap="round"
              />
              <circle
                cx="50"
                cy="50"
                r="40"
                fill="none"
                stroke="url(#gradient2)"
                strokeWidth="12"
                strokeDasharray={`${completedPct * 2.512} 251.2`}
                strokeDashoffset={`-${inProgressPct * 2.512}`}
                strokeLinecap="round"
              />
              <circle
                cx="50"
                cy="50"
                r="40"
                fill="none"
                stroke="url(#gradient3)"
                strokeWidth="12"
                strokeDasharray={`${pendingPct * 2.512} 251.2`}
                strokeDashoffset={`-${(inProgressPct + completedPct) * 2.512}`}
                strokeLinecap="round"
              />
              <defs>
                <linearGradient
                  id="gradient1"
                  x1="0%"
                  y1="0%"
                  x2="100%"
                  y2="0%"
                >
                  <stop offset="0%" stopColor="#00ff88" />
                  <stop offset="100%" stopColor="#00d4ff" />
                </linearGradient>
                <linearGradient
                  id="gradient2"
                  x1="0%"
                  y1="0%"
                  x2="100%"
                  y2="0%"
                >
                  <stop offset="0%" stopColor="#8b5cf6" />
                  <stop offset="100%" stopColor="#ec4899" />
                </linearGradient>
                <linearGradient
                  id="gradient3"
                  x1="0%"
                  y1="0%"
                  x2="100%"
                  y2="0%"
                >
                  <stop offset="0%" stopColor="#f59e0b" />
                  <stop offset="100%" stopColor="#ef4444" />
                </linearGradient>
              </defs>
            </svg>
            <div className="absolute inset-0 flex items-center justify-center">
              <div className="text-center">
                <p className="text-3xl font-bold text-white">
                  {stats.projects.total || data.projects.length}
                </p>
                <p className="text-sm text-gray-400">Projects</p>
              </div>
            </div>
          </div>

          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <div className="w-3 h-3 rounded-full bg-gradient-to-r from-neon-green to-neon-blue" />
                <span className="text-sm text-gray-300">In Progress</span>
              </div>
              <span className="text-sm font-medium text-white">
                {activeProjects} ({inProgressPct}%)
              </span>
            </div>
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <div className="w-3 h-3 rounded-full bg-gradient-to-r from-purple-500 to-pink-500" />
                <span className="text-sm text-gray-300">Completed</span>
              </div>
              <span className="text-sm font-medium text-white">
                {completedProjects} ({completedPct}%)
              </span>
            </div>
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <div className="w-3 h-3 rounded-full bg-gradient-to-r from-amber-500 to-red-500" />
                <span className="text-sm text-gray-300">Pending/On Hold</span>
              </div>
              <span className="text-sm font-medium text-white">
                {pendingProjects} ({pendingPct}%)
              </span>
            </div>
          </div>
        </Card>
      </div>

      {/* Quick Actions */}
      <QuickActions />

      {/* Recent Leads & Projects */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Recent Leads */}
        <Card
          title="Recent Leads"
          subtitle="Latest incoming leads"
          actions={
            <button
              onClick={() => navigate("/leads")}
              className="text-sm text-neon-green hover:text-neon-blue transition-colors"
            >
              View All ({stats.leads.total})
            </button>
          }
        >
          <div className="space-y-4">
            {recentLeads.length === 0 ? (
              <div className="text-center py-8">
                <svg
                  className="w-12 h-12 mx-auto text-gray-600 mb-4"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth="1.5"
                    d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0z"
                  />
                </svg>
                <p className="text-gray-400">No leads found</p>
                <button
                  onClick={() => navigate("/leads/new")}
                  className="mt-4 px-4 py-2 bg-neon-green/10 text-neon-green rounded-lg hover:bg-neon-green/20 transition-colors"
                >
                  Add First Lead
                </button>
              </div>
            ) : (
              recentLeads.map((lead, index) => (
                <div
                  key={lead._id || index}
                  onClick={() => navigate(`/leads/${lead._id}`)}
                  className="flex items-center justify-between p-4 rounded-xl bg-white/[0.02] hover:bg-white/[0.05] border border-white/5 hover:border-neon-green/30 transition-all duration-200 cursor-pointer group"
                >
                  <div className="flex items-center gap-4">
                    <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-purple-500/20 to-pink-500/20 flex items-center justify-center border border-purple-500/20">
                      <span className="text-sm font-medium text-purple-400">
                        {(lead.leadName || lead.name || lead.company || "L")
                          .charAt(0)
                          .toUpperCase()}
                      </span>
                    </div>
                    <div>
                      <p className="text-sm font-medium text-white group-hover:text-neon-green transition-colors">
                        {lead.leadName || lead.name || lead.company}
                      </p>
                      <p className="text-xs text-gray-500">{lead.email}</p>
                    </div>
                  </div>
                  <div className="text-right">
                    {getStatusBadge(lead.status)}
                    <p className="text-xs text-gray-500 mt-1">
                      {formatTimeAgo(lead.createdAt)}
                    </p>
                  </div>
                </div>
              ))
            )}
          </div>
        </Card>

        {/* Active Projects */}
        <Card
          title="Active Projects"
          subtitle="Current project progress"
          actions={
            <button
              onClick={() => navigate("/projects")}
              className="text-sm text-neon-green hover:text-neon-blue transition-colors"
            >
              View All ({stats.projects.total})
            </button>
          }
        >
          <div className="space-y-4">
            {recentProjects.length === 0 ? (
              <div className="text-center py-8">
                <svg
                  className="w-12 h-12 mx-auto text-gray-600 mb-4"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth="1.5"
                    d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2"
                  />
                </svg>
                <p className="text-gray-400">No active projects</p>
                <button
                  onClick={() => navigate("/projects/new")}
                  className="mt-4 px-4 py-2 bg-neon-green/10 text-neon-green rounded-lg hover:bg-neon-green/20 transition-colors"
                >
                  Create Project
                </button>
              </div>
            ) : (
              recentProjects.map((project, index) => (
                <div
                  key={project._id || index}
                  onClick={() => navigate(`/projects/${project._id}`)}
                  className="p-4 rounded-xl bg-white/[0.02] hover:bg-white/[0.05] border border-white/5 hover:border-neon-green/30 transition-all duration-200 cursor-pointer group"
                >
                  <div className="flex items-center justify-between mb-3">
                    <div>
                      <p className="text-sm font-medium text-white group-hover:text-neon-green transition-colors">
                        {project.projectName || project.name}
                      </p>
                      <p className="text-xs text-gray-500">
                        {project.client?.clientName ||
                          project.client?.name ||
                          project.client?.company ||
                          "No client"}
                      </p>
                    </div>
                    {getStatusBadge(project.status)}
                  </div>
                  <div className="flex items-center gap-3">
                    <div className="flex-1 h-2 bg-white/5 rounded-full overflow-hidden">
                      <div
                        className="h-full bg-gradient-to-r from-neon-green to-neon-blue rounded-full transition-all duration-500"
                        style={{ width: `${project.progress || 0}%` }}
                      />
                    </div>
                    <span className="text-sm font-medium text-white">
                      {project.progress || 0}%
                    </span>
                  </div>
                </div>
              ))
            )}
          </div>
        </Card>
      </div>

      {/* Recent Activity */}
      <RecentActivity
        activities={activities}
        onActivityClick={handleActivityClick}
        onViewAll={() => navigate("/leads")}
      />

      {/* Activity Detail Modal */}
      <Modal
        isOpen={showActivityModal}
        onClose={() => setShowActivityModal(false)}
        title="Activity Details"
      >
        {selectedActivity && (
          <div className="space-y-4">
            <div className="p-4 rounded-xl bg-white/5 border border-white/10">
              <div className="flex items-center gap-3 mb-3">
                <div
                  className={`p-2 rounded-lg bg-gradient-to-br ${selectedActivity.color}`}
                >
                  <svg
                    className="w-5 h-5 text-white"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth="2"
                      d={selectedActivity.icon}
                    />
                  </svg>
                </div>
                <div>
                  <h3 className="text-white font-semibold">
                    {selectedActivity.title}
                  </h3>
                  <p className="text-gray-400 text-sm">
                    {selectedActivity.description}
                  </p>
                </div>
              </div>

              <div className="space-y-2 text-sm">
                <div className="flex justify-between">
                  <span className="text-gray-400">Time:</span>
                  <span className="text-white">{selectedActivity.time}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-400">Type:</span>
                  <span className="text-white capitalize">
                    {selectedActivity.type}
                  </span>
                </div>
                {selectedActivity.statusChange && (
                  <div className="flex justify-between items-center">
                    <span className="text-gray-400">Status Change:</span>
                    <div className="flex items-center gap-2">
                      <span
                        className={`px-2 py-0.5 rounded text-xs ${getStatusBadgeStyle(selectedActivity.statusChange.from)}`}
                      >
                        {selectedActivity.statusChange.from}
                      </span>
                      <svg
                        className="w-4 h-4 text-gray-500"
                        fill="none"
                        stroke="currentColor"
                        viewBox="0 0 24 24"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth="2"
                          d="M13 7l5 5m0 0l-5 5m5-5H6"
                        />
                      </svg>
                      <span
                        className={`px-2 py-0.5 rounded text-xs ${getStatusBadgeStyle(selectedActivity.statusChange.to)}`}
                      >
                        {selectedActivity.statusChange.to}
                      </span>
                    </div>
                  </div>
                )}
              </div>
            </div>

            {/* Type specific details */}
            {selectedActivity.type === "lead" && selectedActivity.data && (
              <div className="p-4 rounded-xl bg-white/5 border border-white/10 space-y-2">
                <h4 className="text-white font-medium mb-2">Lead Details</h4>
                <div className="grid grid-cols-2 gap-2 text-sm">
                  <div>
                    <span className="text-gray-400">Name:</span>
                    <span className="text-white ml-2">
                      {selectedActivity.data.leadName ||
                        selectedActivity.data.name}
                    </span>
                  </div>
                  <div>
                    <span className="text-gray-400">Email:</span>
                    <span className="text-white ml-2">
                      {selectedActivity.data.email}
                    </span>
                  </div>
                  {selectedActivity.data.phone && (
                    <div>
                      <span className="text-gray-400">Phone:</span>
                      <span className="text-white ml-2">
                        {selectedActivity.data.phone}
                      </span>
                    </div>
                  )}
                  {selectedActivity.data.source && (
                    <div>
                      <span className="text-gray-400">Source:</span>
                      <span className="text-white ml-2 capitalize">
                        {selectedActivity.data.source}
                      </span>
                    </div>
                  )}
                </div>
              </div>
            )}

            {selectedActivity.type === "project" && selectedActivity.data && (
              <div className="p-4 rounded-xl bg-white/5 border border-white/10 space-y-2">
                <h4 className="text-white font-medium mb-2">Project Details</h4>
                <div className="space-y-2 text-sm">
                  <div className="flex justify-between">
                    <span className="text-gray-400">Progress:</span>
                    <span className="text-white">
                      {selectedActivity.data.progress || 0}%
                    </span>
                  </div>
                  {selectedActivity.data.budget && (
                    <div className="flex justify-between">
                      <span className="text-gray-400">Budget:</span>
                      <span className="text-neon-green">
                        {formatCurrencyFull(selectedActivity.data.budget)}
                      </span>
                    </div>
                  )}
                </div>
              </div>
            )}

            {selectedActivity.type === "invoice" && selectedActivity.data && (
              <div className="p-4 rounded-xl bg-white/5 border border-white/10 space-y-2">
                <h4 className="text-white font-medium mb-2">Invoice Details</h4>
                <div className="flex justify-between text-sm">
                  <span className="text-gray-400">Amount:</span>
                  <span className="text-neon-green font-semibold">
                    {formatCurrencyFull(selectedActivity.data.total)}
                  </span>
                </div>
              </div>
            )}

            <div className="flex gap-3">
              <button
                onClick={() => setShowActivityModal(false)}
                className="flex-1 px-4 py-2 bg-white/5 text-white rounded-xl hover:bg-white/10 transition-colors"
              >
                Close
              </button>
              <button
                onClick={handleViewActivityDetail}
                className="flex-1 px-4 py-2 bg-neon-green text-black font-semibold rounded-xl hover:bg-neon-green/90 transition-colors"
              >
                View Full Details
              </button>
            </div>
          </div>
        )}
      </Modal>

      {/* Chart Detail Modal */}
      <Modal
        isOpen={showChartModal}
        onClose={() => setShowChartModal(false)}
        title={`Revenue Details - ${selectedChartData?.label || ""}`}
      >
        {selectedChartData && (
          <div className="space-y-4">
            {/* Summary */}
            <div className="grid grid-cols-2 gap-4">
              <div className="p-4 rounded-xl bg-neon-green/10 border border-neon-green/30">
                <p className="text-xs text-gray-400 uppercase">Total Revenue</p>
                <p className="text-2xl font-bold text-neon-green mt-1">
                  {formatCurrencyFull(selectedChartData.total || 0)}
                </p>
              </div>
              <div className="p-4 rounded-xl bg-green-500/10 border border-green-500/30">
                <p className="text-xs text-gray-400 uppercase">Received</p>
                <p className="text-2xl font-bold text-green-400 mt-1">
                  {formatCurrencyFull(selectedChartData.paid || 0)}
                </p>
              </div>
            </div>

            {/* Pending */}
            <div className="p-4 rounded-xl bg-amber-500/10 border border-amber-500/30">
              <div className="flex justify-between items-center">
                <div>
                  <p className="text-xs text-gray-400 uppercase">
                    Pending Amount
                  </p>
                  <p className="text-xl font-bold text-amber-400 mt-1">
                    {formatCurrencyFull(selectedChartData.pending || 0)}
                  </p>
                </div>
                <div className="text-right">
                  <p className="text-xs text-gray-400">Collection Rate</p>
                  <p className="text-lg font-bold text-white">
                    {selectedChartData.total > 0
                      ? Math.round(
                          ((selectedChartData.paid || 0) /
                            selectedChartData.total) *
                            100
                        )
                      : 0}
                    %
                  </p>
                </div>
              </div>
            </div>

            {/* Projects Count */}
            <div className="p-4 rounded-xl bg-white/5 border border-white/10">
              <div className="flex justify-between items-center">
                <span className="text-gray-400">Completed Projects</span>
                <span className="text-white font-bold text-lg">
                  {selectedChartData.projectCount || 0}
                </span>
              </div>
            </div>

            {/* Projects List */}
            {selectedChartData.projects &&
            selectedChartData.projects.length > 0 ? (
              <div className="space-y-3">
                <h4 className="text-white font-medium">Projects</h4>
                <div className="max-h-60 overflow-y-auto space-y-2">
                  {selectedChartData.projects.map((project, idx) => (
                    <div
                      key={idx}
                      onClick={() => {
                        setShowChartModal(false);
                        navigate(`/projects/${project.id}`);
                      }}
                      className="p-3 rounded-xl bg-white/5 border border-white/10 hover:border-neon-green/30 cursor-pointer transition-colors"
                    >
                      <div className="flex justify-between items-start">
                        <div className="flex-1">
                          <p className="text-white font-medium text-sm truncate">
                            {project.name}
                          </p>
                          <p className="text-xs text-gray-500">
                            {project.client}
                          </p>
                        </div>
                        <div className="text-right ml-3">
                          <p className="text-neon-green font-semibold text-sm">
                            {formatCurrencyFull(project.budget)}
                          </p>
                          <p className="text-xs text-gray-500">
                            Paid: {formatCurrency(project.amountPaid || 0)}
                          </p>
                        </div>
                      </div>
                      {/* Payment Progress */}
                      <div className="mt-2">
                        <div className="h-1.5 bg-white/10 rounded-full overflow-hidden">
                          <div
                            className="h-full bg-gradient-to-r from-neon-green to-neon-blue rounded-full"
                            style={{
                              width: `${Math.min(((project.amountPaid || 0) / (project.budget || 1)) * 100, 100)}%`,
                            }}
                          />
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            ) : (
              <div className="text-center py-6">
                <p className="text-gray-500">No projects in this period</p>
              </div>
            )}

            <button
              onClick={() => setShowChartModal(false)}
              className="w-full px-4 py-3 bg-white/5 text-white rounded-xl hover:bg-white/10 transition-colors"
            >
              Close
            </button>
          </div>
        )}
      </Modal>

      {/* Revenue Modal */}
      <Modal
        isOpen={showRevenueModal}
        onClose={() => setShowRevenueModal(false)}
        title="Revenue from Completed Projects"
      >
        <div className="space-y-4">
          {/* Summary Cards */}
          <div className="grid grid-cols-3 gap-4 mb-6">
            <div className="p-4 rounded-xl bg-green-500/10 border border-green-500/30 text-center">
              <p className="text-xs text-gray-400 uppercase">Total Budget</p>
              <p className="text-xl font-bold text-green-400 mt-1">
                {formatCurrencyFull(totalRevenue)}
              </p>
            </div>
            <div className="p-4 rounded-xl bg-neon-green/10 border border-neon-green/30 text-center">
              <p className="text-xs text-gray-400 uppercase">Received</p>
              <p className="text-xl font-bold text-neon-green mt-1">
                {formatCurrencyFull(paidRevenue)}
              </p>
            </div>
            <div className="p-4 rounded-xl bg-amber-500/10 border border-amber-500/30 text-center">
              <p className="text-xs text-gray-400 uppercase">Pending</p>
              <p className="text-xl font-bold text-amber-400 mt-1">
                {formatCurrencyFull(pendingRevenue)}
              </p>
            </div>
          </div>

          {/* Completed Projects Count */}
          <div className="p-4 rounded-xl bg-white/5 border border-white/10">
            <div className="flex justify-between items-center">
              <span className="text-gray-400">Completed Projects</span>
              <span className="text-white font-bold text-lg">
                {completedProjects}
              </span>
            </div>
          </div>

          {/* Completed Projects List */}
          {data.projects.filter((p) => p.status === "completed").length > 0 ? (
            <div className="space-y-3">
              <h4 className="text-white font-medium">All Completed Projects</h4>
              <div className="max-h-60 overflow-y-auto space-y-2">
                {data.projects
                  .filter((p) => p.status === "completed")
                  .sort(
                    (a, b) =>
                      new Date(b.completedDate || b.updatedAt) -
                      new Date(a.completedDate || a.updatedAt)
                  )
                  .map((project) => (
                    <div
                      key={project._id}
                      onClick={() => {
                        setShowRevenueModal(false);
                        navigate(`/projects/${project._id}`);
                      }}
                      className="p-3 rounded-xl bg-white/5 border border-white/10 hover:border-neon-green/30 transition-colors cursor-pointer"
                    >
                      <div className="flex justify-between items-start">
                        <div>
                          <p className="text-white font-medium text-sm">
                            {project.projectName || project.name}
                          </p>
                          <p className="text-xs text-gray-500">
                            {project.client?.businessName ||
                              project.client?.clientName ||
                              "No client"}
                          </p>
                        </div>
                        <div className="text-right">
                          <p className="text-neon-green font-semibold text-sm">
                            {formatCurrencyFull(project.budget)}
                          </p>
                          <p className="text-xs text-gray-500">
                            Paid: {formatCurrency(project.amountPaid || 0)}
                          </p>
                        </div>
                      </div>
                      {/* Payment Progress */}
                      <div className="mt-2">
                        <div className="h-1.5 bg-white/10 rounded-full overflow-hidden">
                          <div
                            className="h-full bg-gradient-to-r from-neon-green to-neon-blue rounded-full"
                            style={{
                              width: `${Math.min(((project.amountPaid || 0) / (project.budget || 1)) * 100, 100)}%`,
                            }}
                          />
                        </div>
                        <div className="flex justify-between mt-1 text-xs text-gray-500">
                          <span>
                            {Math.round(
                              ((project.amountPaid || 0) /
                                (project.budget || 1)) *
                                100
                            )}
                            % paid
                          </span>
                          <span>
                            Balance:{" "}
                            {formatCurrency(
                              (project.budget || 0) - (project.amountPaid || 0)
                            )}
                          </span>
                        </div>
                      </div>
                    </div>
                  ))}
              </div>
            </div>
          ) : (
            <div className="text-center py-8">
              <svg
                className="w-12 h-12 mx-auto text-gray-600 mb-4"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth="1.5"
                  d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2"
                />
              </svg>
              <p className="text-gray-400">No completed projects yet</p>
              <p className="text-gray-500 text-sm mt-1">
                Complete projects to see revenue
              </p>
            </div>
          )}

          <button
            onClick={() => {
              setShowRevenueModal(false);
              navigate("/projects?status=completed");
            }}
            className="w-full px-4 py-2 bg-neon-green/10 text-neon-green rounded-xl hover:bg-neon-green/20 transition-colors"
          >
            View All Completed Projects
          </button>
        </div>
      </Modal>
    </div>
  );
};

export default Dashboard;
