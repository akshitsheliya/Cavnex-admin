import React, { useState, useEffect, useRef } from "react";
import StatCard from "../../components/dashboard/StatCard";
import RecentActivity from "../../components/dashboard/RecentActivity";
import QuickActions from "../../components/dashboard/QuickActions";
import ChartCard from "../../components/dashboard/ChartCard";
import Card from "../../components/common/Card";
import useAuth from "../../hooks/useAuth";
import api from "../../services/api";

const Dashboard = () => {
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
      const results = await Promise.allSettled([
        api.get("/leads"),
        api.get("/clients"),
        api.get("/projects"),
        api.get("/invoices"),
      ]);

      const extractData = (result) => {
        if (result.status === "fulfilled") {
          const d = result.value.data.data || result.value.data;
          return Array.isArray(d) ? d : [];
        }
        return [];
      };

      setData({
        leads: extractData(results[0]),
        clients: extractData(results[1]),
        projects: extractData(results[2]),
        invoices: extractData(results[3]),
      });
    } catch (error) {
      console.error("Failed to fetch dashboard data:", error);
    } finally {
      setLoading(false);
    }
  };

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

  const totalRevenue = data.invoices
    .filter((inv) => inv.status === "paid")
    .reduce((sum, inv) => sum + (inv.total || inv.amount || 0), 0);

  const activeClients =
    data.clients.filter((c) => c.status === "active").length ||
    data.clients.length;

  const activeProjects = data.projects.filter(
    (p) => p.status === "in_progress" || p.status === "active"
  ).length;

  const totalProjects = data.projects.length || 1;
  const completedProjects = data.projects.filter(
    (p) => p.status === "completed"
  ).length;
  const pendingProjects = data.projects.filter(
    (p) => p.status === "pending" || p.status === "on_hold"
  ).length;

  const inProgressPct = Math.round((activeProjects / totalProjects) * 100);
  const completedPct = Math.round((completedProjects / totalProjects) * 100);
  const pendingPct = Math.round((pendingProjects / totalProjects) * 100);

  const revenueChartData = (() => {
    const monthly = Array(12).fill(0);
    data.invoices
      .filter((inv) => inv.status === "paid")
      .forEach((inv) => {
        const m = new Date(inv.paidAt || inv.createdAt).getMonth();
        monthly[m] += inv.total || inv.amount || 0;
      });
    const max = Math.max(...monthly, 1);
    return monthly.map((v) => Math.round((v / max) * 100));
  })();

  const recentLeads = [...data.leads]
    .sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt))
    .slice(0, 4);

  const recentProjects = data.projects
    .filter(
      (p) =>
        p.status === "in_progress" ||
        p.status === "active" ||
        p.status === "pending"
    )
    .sort(
      (a, b) =>
        new Date(b.updatedAt || b.createdAt) -
        new Date(a.updatedAt || a.createdAt)
    )
    .slice(0, 4);

  const activities = (() => {
    const acts = [];

    data.leads.slice(0, 3).forEach((l) => {
      acts.push({
        id: l._id,
        type: "lead",
        title: "New lead received",
        description: `${l.name || l.company || "Unknown"} submitted a contact form`,
        time: formatTimeAgo(l.createdAt),
        icon: "M18 9v3m0 0v3m0-3h3m-3 0h-3m-2-5a4 4 0 11-8 0 4 4 0 018 0zM3 20a6 6 0 0112 0v1H3v-1z",
        color: "from-purple-500 to-pink-500",
        sortDate: l.createdAt,
      });
    });

    data.projects.slice(0, 3).forEach((p) => {
      acts.push({
        id: p._id,
        type: "project",
        title: "Project updated",
        description: `${p.name} - ${p.progress || 0}% completed`,
        time: formatTimeAgo(p.updatedAt || p.createdAt),
        icon: "M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z",
        color: "from-neon-green to-neon-blue",
        sortDate: p.updatedAt || p.createdAt,
      });
    });

    data.invoices.slice(0, 3).forEach((inv) => {
      acts.push({
        id: inv._id,
        type: "invoice",
        title: inv.status === "paid" ? "Invoice paid" : "Invoice created",
        description: `${inv.client?.name || inv.client?.company || "Client"} - ₹${(inv.total || inv.amount || 0).toLocaleString("en-IN")}`,
        time: formatTimeAgo(inv.updatedAt || inv.createdAt),
        icon: "M17 9V7a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2m2 4h10a2 2 0 002-2v-6a2 2 0 00-2-2H9a2 2 0 00-2 2v6a2 2 0 002 2z",
        color: "from-green-400 to-emerald-500",
        sortDate: inv.updatedAt || inv.createdAt,
      });
    });

    data.clients.slice(0, 3).forEach((c) => {
      acts.push({
        id: c._id,
        type: "client",
        title: "Client onboarded",
        description: `${c.name || c.company || "Unknown"} completed onboarding`,
        time: formatTimeAgo(c.createdAt),
        icon: "M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197M13 7a4 4 0 11-8 0 4 4 0 018 0z",
        color: "from-amber-500 to-orange-500",
        sortDate: c.createdAt,
      });
    });

    return acts
      .sort((a, b) => new Date(b.sortDate) - new Date(a.sortDate))
      .slice(0, 5);
  })();

  const stats = [
    {
      label: "Total Leads",
      value: data.leads.length.toString(),
      change: "+12%",
      changeType: "positive",
      icon: "M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0z",
      gradient: "from-purple-500 to-pink-500",
    },
    {
      label: "Active Clients",
      value: activeClients.toString(),
      change: "+8%",
      changeType: "positive",
      icon: "M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197M13 7a4 4 0 11-8 0 4 4 0 018 0z",
      gradient: "from-neon-green to-neon-blue",
    },
    {
      label: "Active Projects",
      value: activeProjects.toString(),
      change: "+23%",
      changeType: "positive",
      icon: "M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2",
      gradient: "from-neon-blue to-purple-500",
    },
    {
      label: "Total Revenue",
      value: formatCurrency(totalRevenue),
      change: "+18%",
      changeType: "positive",
      icon: "M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z",
      gradient: "from-green-400 to-emerald-500",
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
    };
    return (
      <span className={badges[status] || "badge-info"}>
        {labels[status] || status}
      </span>
    );
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
          {/* <button className="btn-neon flex items-center gap-2">
            <svg
              className="w-5 h-5"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth="2"
                d="M12 4v16m8-8H4"
              />
            </svg>
            Add New
          </button> */}
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {stats.map((stat, index) => (
          <StatCard key={index} {...stat} />
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2">
          <Card title="Revenue Overview" subtitle="Monthly revenue trends">
            <ChartCard
              // title="Revenue Overview"
              // subtitle="Monthly revenue trends"
              type="bar"
              data={revenueChartData}
              period={chartPeriod}
              onPeriodChange={setChartPeriod}
            />
          </Card>
        </div>

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
                  {data.projects.length}
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
                {inProgressPct}%
              </span>
            </div>
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <div className="w-3 h-3 rounded-full bg-gradient-to-r from-purple-500 to-pink-500" />
                <span className="text-sm text-gray-300">Completed</span>
              </div>
              <span className="text-sm font-medium text-white">
                {completedPct}%
              </span>
            </div>
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <div className="w-3 h-3 rounded-full bg-gradient-to-r from-amber-500 to-red-500" />
                <span className="text-sm text-gray-300">Pending</span>
              </div>
              <span className="text-sm font-medium text-white">
                {pendingPct}%
              </span>
            </div>
          </div>
        </Card>
      </div>

      <QuickActions />

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card
          title="Recent Leads"
          subtitle="Latest incoming leads"
          actions={
            <button className="text-sm text-neon-green hover:text-neon-blue transition-colors">
              View All
            </button>
          }
        >
          <div className="space-y-4">
            {recentLeads.length === 0 ? (
              <div className="text-center py-8">
                <p className="text-gray-400">No leads found</p>
              </div>
            ) : (
              recentLeads.map((lead, index) => (
                <div
                  key={lead._id || index}
                  className="flex items-center justify-between p-4 rounded-xl bg-white/[0.02] hover:bg-white/[0.05] border border-white/5 hover:border-white/10 transition-all duration-200 cursor-pointer group"
                >
                  <div className="flex items-center gap-4">
                    <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-purple-500/20 to-pink-500/20 flex items-center justify-center border border-purple-500/20">
                      <span className="text-sm font-medium text-purple-400">
                        {(lead.name || lead.company || "L")
                          .charAt(0)
                          .toUpperCase()}
                      </span>
                    </div>
                    <div>
                      <p className="text-sm font-medium text-white group-hover:text-neon-green transition-colors">
                        {lead.name || lead.company}
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

        <Card
          title="Active Projects"
          subtitle="Current project progress"
          actions={
            <button className="text-sm text-neon-green hover:text-neon-blue transition-colors">
              View All
            </button>
          }
        >
          <div className="space-y-4">
            {recentProjects.length === 0 ? (
              <div className="text-center py-8">
                <p className="text-gray-400">No active projects</p>
              </div>
            ) : (
              recentProjects.map((project, index) => (
                <div
                  key={project._id || index}
                  className="p-4 rounded-xl bg-white/[0.02] hover:bg-white/[0.05] border border-white/5 hover:border-white/10 transition-all duration-200 cursor-pointer group"
                >
                  <div className="flex items-center justify-between mb-3">
                    <div>
                      <p className="text-sm font-medium text-white group-hover:text-neon-green transition-colors">
                        {project.name}
                      </p>
                      <p className="text-xs text-gray-500">
                        {project.client?.name ||
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

      <RecentActivity activities={activities} />
    </div>
  );
};

export default Dashboard;
