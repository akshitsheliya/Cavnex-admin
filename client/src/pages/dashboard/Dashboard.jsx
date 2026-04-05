import React, { useState, useEffect, useMemo } from "react";
import { useNavigate } from "react-router-dom";
import useAuth from "../../hooks/useAuth";
import useDashboardData from "../../hooks/useDashboardData";
import {
  DashboardHeader,
  StatCard,
  RevenueChart,
  ProjectStatusChart,
  RecentLeads,
  ActiveProjects,
  RecentActivity,
  QuickActions,
  ChartDetailModal,
  ActivityDetailModal,
  RevenueDetailModal,
} from "../../components/dashboard";
import {
  formatCurrency,
  formatTimeAgo,
  generateActivities,
} from "../../utils/dashboardHelpers";
import useNotifications from "../../hooks/useNotifications";
import { eventBus, EVENTS } from "../../../../server/utils/eventBus";

const Dashboard = () => {
  const navigate = useNavigate();
  const { user } = useAuth();
  const { loading, data, stats, revenueData, refresh } = useDashboardData();
  const [chartPeriod, setChartPeriod] = useState("year");
  const [currentTime, setCurrentTime] = useState(new Date());
  const [selectedActivity, setSelectedActivity] = useState(null);
  const [showActivityModal, setShowActivityModal] = useState(false);
  const [showRevenueModal, setShowRevenueModal] = useState(false);
  const [showChartModal, setShowChartModal] = useState(false);
  const [selectedChartData, setSelectedChartData] = useState(null);
  const { refresh: refreshNotifications } = useNotifications();
  useEffect(() => {
    const timer = setInterval(() => setCurrentTime(new Date()), 60000);
    return () => clearInterval(timer);
  }, []);

  const chartData = useMemo(() => {
    if (
      chartPeriod === "all" &&
      revenueData.yearly &&
      revenueData.yearly.length > 0
    ) {
      return revenueData.yearly;
    } else if (chartPeriod === "6months") {
      const currentMonth = new Date().getMonth();
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
      const last6Months = [];
      for (let i = 5; i >= 0; i--) {
        const monthIndex = (currentMonth - i + 12) % 12;
        last6Months.push(
          revenueData.monthly[monthIndex] || {
            month: months[monthIndex],
            shortMonth: months[monthIndex].substring(0, 3),
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
  }, [chartPeriod, revenueData]);

  useEffect(() => {
    const handleReminderChange = () => {
      console.log("🔔 Dashboard: Reminder changed, refreshing stats");
      fetchDashboardData(); // Your existing fetch function
      refreshNotifications(); // Refresh notification context
    };

    eventBus.on(EVENTS.REMINDER_CREATED, handleReminderChange);
    eventBus.on(EVENTS.REMINDER_UPDATED, handleReminderChange);
    eventBus.on(EVENTS.REMINDER_DELETED, handleReminderChange);
    eventBus.on(EVENTS.LEAD_STATUS_CHANGED, handleReminderChange);

    return () => {
      eventBus.off(EVENTS.REMINDER_CREATED, handleReminderChange);
      eventBus.off(EVENTS.REMINDER_UPDATED, handleReminderChange);
      eventBus.off(EVENTS.REMINDER_DELETED, handleReminderChange);
      eventBus.off(EVENTS.LEAD_STATUS_CHANGED, handleReminderChange);
    };
  }, [refreshNotifications]);

  const chartMaxValue = useMemo(
    () => Math.max(...chartData.map((d) => d.total || 0), 1),
    [chartData]
  );
  const chartTotalRevenue = useMemo(
    () => chartData.reduce((sum, d) => sum + (d.total || 0), 0),
    [chartData]
  );
  const chartTotalPaid = useMemo(
    () => chartData.reduce((sum, d) => sum + (d.paid || 0), 0),
    [chartData]
  );
  const chartTotalProjects = useMemo(
    () => chartData.reduce((sum, d) => sum + (d.projectCount || 0), 0),
    [chartData]
  );

  const activities = useMemo(
    () => generateActivities(data, formatTimeAgo),
    [data]
  );

  const activeProjects = useMemo(() => {
    return (
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
      ).length
    );
  }, [stats.projects.active, data.projects]);

  const activeClients = useMemo(() => {
    return (
      stats.clients.active ||
      data.clients.filter((c) => c.status === "active").length ||
      data.clients.length
    );
  }, [stats.clients.active, data.clients]);

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

  const recentLeads = useMemo(() => {
    return [...data.leads]
      .sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt))
      .slice(0, 4);
  }, [data.leads]);

  const recentProjects = useMemo(() => {
    return data.projects
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
  }, [data.projects]);

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

  const handleActivityClick = (activity) => {
    setSelectedActivity(activity);
    setShowActivityModal(true);
  };

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
      value: formatCurrency(stats.revenue.total),
      change:
        stats.revenue.paid > 0
          ? `${formatCurrency(stats.revenue.paid)} received`
          : completedProjects > 0
            ? `${completedProjects} projects`
            : "No completed",
      changeType: stats.revenue.total > 0 ? "positive" : "neutral",
      icon: "M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z",
      gradient: "from-green-400 to-emerald-500",
      onClick: () => setShowRevenueModal(true),
    },
  ];

  if (loading) {
    return (
      <div className="space-y-8">
        <DashboardHeader
          userName={user?.name?.split(" ")[0] || "Admin"}
          currentTime={currentTime}
          onRefresh={refresh}
        />
        <div className="animate-pulse space-y-8">
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6">
            {[...Array(4)].map((_, i) => (
              <div key={i} className="glass-card p-6">
                <div className="h-12 w-12 bg-white/10 rounded-xl mb-4" />
                <div className="h-4 w-24 bg-white/10 rounded mb-2" />
                <div className="h-8 w-16 bg-white/10 rounded" />
              </div>
            ))}
          </div>
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-4 sm:gap-6">
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
      <DashboardHeader
        userName={user?.name?.split(" ")[0] || "Admin"}
        currentTime={currentTime}
        onRefresh={refresh}
      />

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6">
        {statCards.map((stat, index) => (
          <StatCard key={index} {...stat} />
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-4 sm:gap-6">
        <div className="lg:col-span-2">
          <RevenueChart
            chartData={chartData}
            chartPeriod={chartPeriod}
            onPeriodChange={setChartPeriod}
            onBarClick={handleBarClick}
            chartMaxValue={chartMaxValue}
            chartTotalRevenue={chartTotalRevenue}
            chartTotalPaid={chartTotalPaid}
            chartTotalProjects={chartTotalProjects}
          />
        </div>
        <ProjectStatusChart
          totalProjects={totalProjects}
          activeProjects={activeProjects}
          completedProjects={completedProjects}
          pendingProjects={pendingProjects}
          inProgressPct={inProgressPct}
          completedPct={completedPct}
          pendingPct={pendingPct}
        />
      </div>

      <QuickActions />

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <RecentLeads leads={recentLeads} totalLeads={stats.leads.total} />
        <ActiveProjects
          projects={recentProjects}
          totalProjects={stats.projects.total}
        />
      </div>

      <RecentActivity
        activities={activities}
        onActivityClick={handleActivityClick}
        onViewAll={() => navigate("/leads")}
      />

      <ChartDetailModal
        isOpen={showChartModal}
        onClose={() => setShowChartModal(false)}
        data={selectedChartData}
      />

      <ActivityDetailModal
        isOpen={showActivityModal}
        onClose={() => setShowActivityModal(false)}
        activity={selectedActivity}
      />

      <RevenueDetailModal
        isOpen={showRevenueModal}
        onClose={() => setShowRevenueModal(false)}
        totalRevenue={stats.revenue.total}
        paidRevenue={stats.revenue.paid}
        pendingRevenue={stats.revenue.pending}
        completedProjects={completedProjects}
        projects={data.projects}
      />
    </div>
  );
};

export default Dashboard;
