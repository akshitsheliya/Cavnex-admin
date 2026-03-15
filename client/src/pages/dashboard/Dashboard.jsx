import React, { useState, useEffect } from "react";
import StatCard from "../../components/dashboard/StatCard";
import RecentActivity from "../../components/dashboard/RecentActivity";
import QuickActions from "../../components/dashboard/QuickActions";
import ChartCard from "../../components/dashboard/ChartCard";
import Card from "../../components/common/Card";
import useAuth from "../../hooks/useAuth";

const Dashboard = () => {
  const { user } = useAuth();
  const [chartPeriod, setChartPeriod] = useState("year");
  const [currentTime, setCurrentTime] = useState(new Date());

  useEffect(() => {
    const timer = setInterval(() => setCurrentTime(new Date()), 60000);
    return () => clearInterval(timer);
  }, []);

  const getGreeting = () => {
    const hour = currentTime.getHours();
    if (hour < 12) return "Good morning";
    if (hour < 17) return "Good afternoon";
    return "Good evening";
  };

  const stats = [
    {
      label: "Total Leads",
      value: "248",
      change: "+12%",
      changeType: "positive",
      icon: "M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0z",
      gradient: "from-purple-500 to-pink-500",
    },
    {
      label: "Active Clients",
      value: "64",
      change: "+8%",
      changeType: "positive",
      icon: "M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197M13 7a4 4 0 11-8 0 4 4 0 018 0z",
      gradient: "from-neon-green to-neon-blue",
    },
    {
      label: "Active Projects",
      value: "32",
      change: "+23%",
      changeType: "positive",
      icon: "M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2",
      gradient: "from-neon-blue to-purple-500",
    },
    {
      label: "Total Revenue",
      value: "₹24.5L",
      change: "+18%",
      changeType: "positive",
      icon: "M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z",
      gradient: "from-green-400 to-emerald-500",
    },
  ];

  const recentLeads = [
    {
      name: "Acme Corporation",
      email: "contact@acme.com",
      status: "new",
      date: "2 hours ago",
    },
    {
      name: "Tech Startups Inc",
      email: "hello@techstartups.io",
      status: "contacted",
      date: "5 hours ago",
    },
    {
      name: "Digital Solutions",
      email: "info@digitalsol.com",
      status: "qualified",
      date: "1 day ago",
    },
    {
      name: "Growth Labs",
      email: "team@growthlabs.co",
      status: "proposal_sent",
      date: "2 days ago",
    },
  ];

  const recentProjects = [
    {
      name: "E-commerce Platform",
      client: "Acme Corp",
      progress: 75,
      status: "in_progress",
    },
    {
      name: "Mobile App Development",
      client: "Tech Startups",
      progress: 45,
      status: "in_progress",
    },
    {
      name: "Website Redesign",
      client: "Digital Solutions",
      progress: 90,
      status: "in_progress",
    },
    {
      name: "CRM Integration",
      client: "Growth Labs",
      progress: 20,
      status: "pending",
    },
  ];

  const getStatusBadge = (status) => {
    const badges = {
      new: "badge-purple",
      contacted: "badge-info",
      qualified: "badge-success",
      proposal_sent: "badge-warning",
      in_progress: "badge-info",
      pending: "badge-warning",
      completed: "badge-success",
    };
    const labels = {
      new: "New",
      contacted: "Contacted",
      qualified: "Qualified",
      proposal_sent: "Proposal Sent",
      in_progress: "In Progress",
      pending: "Pending",
      completed: "Completed",
    };
    return <span className={badges[status]}>{labels[status]}</span>;
  };

  return (
    <div className="space-y-8">
      <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold text-white">
            {getGreeting()}, {user?.name?.split(" ")[0] || "Admin"}! 👋
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
          <button className="btn-outline-neon flex items-center gap-2">
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
                d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4"
              />
            </svg>
            Export
          </button>
          <button className="btn-neon flex items-center gap-2">
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
          </button>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {stats.map((stat, index) => (
          <StatCard key={index} {...stat} />
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2">
          <ChartCard
            title="Revenue Overview"
            subtitle="Monthly revenue trends"
            type="bar"
            period={chartPeriod}
            onPeriodChange={setChartPeriod}
          />
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
                strokeDasharray="150 251.2"
                strokeLinecap="round"
              />
              <circle
                cx="50"
                cy="50"
                r="40"
                fill="none"
                stroke="url(#gradient2)"
                strokeWidth="12"
                strokeDasharray="75 251.2"
                strokeDashoffset="-150"
                strokeLinecap="round"
              />
              <circle
                cx="50"
                cy="50"
                r="40"
                fill="none"
                stroke="url(#gradient3)"
                strokeWidth="12"
                strokeDasharray="26.2 251.2"
                strokeDashoffset="-225"
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
                <p className="text-3xl font-bold text-white">32</p>
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
              <span className="text-sm font-medium text-white">60%</span>
            </div>
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <div className="w-3 h-3 rounded-full bg-gradient-to-r from-purple-500 to-pink-500" />
                <span className="text-sm text-gray-300">Completed</span>
              </div>
              <span className="text-sm font-medium text-white">30%</span>
            </div>
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <div className="w-3 h-3 rounded-full bg-gradient-to-r from-amber-500 to-red-500" />
                <span className="text-sm text-gray-300">Pending</span>
              </div>
              <span className="text-sm font-medium text-white">10%</span>
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
            {recentLeads.map((lead, index) => (
              <div
                key={index}
                className="flex items-center justify-between p-4 rounded-xl bg-white/[0.02] hover:bg-white/[0.05] border border-white/5 hover:border-white/10 transition-all duration-200 cursor-pointer group"
              >
                <div className="flex items-center gap-4">
                  <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-purple-500/20 to-pink-500/20 flex items-center justify-center border border-purple-500/20">
                    <span className="text-sm font-medium text-purple-400">
                      {lead.name.charAt(0)}
                    </span>
                  </div>
                  <div>
                    <p className="text-sm font-medium text-white group-hover:text-neon-green transition-colors">
                      {lead.name}
                    </p>
                    <p className="text-xs text-gray-500">{lead.email}</p>
                  </div>
                </div>
                <div className="text-right">
                  {getStatusBadge(lead.status)}
                  <p className="text-xs text-gray-500 mt-1">{lead.date}</p>
                </div>
              </div>
            ))}
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
            {recentProjects.map((project, index) => (
              <div
                key={index}
                className="p-4 rounded-xl bg-white/[0.02] hover:bg-white/[0.05] border border-white/5 hover:border-white/10 transition-all duration-200 cursor-pointer group"
              >
                <div className="flex items-center justify-between mb-3">
                  <div>
                    <p className="text-sm font-medium text-white group-hover:text-neon-green transition-colors">
                      {project.name}
                    </p>
                    <p className="text-xs text-gray-500">{project.client}</p>
                  </div>
                  {getStatusBadge(project.status)}
                </div>
                <div className="flex items-center gap-3">
                  <div className="flex-1 h-2 bg-white/5 rounded-full overflow-hidden">
                    <div
                      className="h-full bg-gradient-to-r from-neon-green to-neon-blue rounded-full transition-all duration-500"
                      style={{ width: `${project.progress}%` }}
                    />
                  </div>
                  <span className="text-sm font-medium text-white">
                    {project.progress}%
                  </span>
                </div>
              </div>
            ))}
          </div>
        </Card>
      </div>

      <RecentActivity />
    </div>
  );
};

export default Dashboard;
