export const formatCurrency = (amount) => {
  if (amount >= 10000000) return `₹${(amount / 10000000).toFixed(1)}Cr`;
  if (amount >= 100000) return `₹${(amount / 100000).toFixed(1)}L`;
  if (amount >= 1000) return `₹${(amount / 1000).toFixed(1)}K`;
  return `₹${amount}`;
};

export const formatCurrencyFull = (amount) => {
  return new Intl.NumberFormat("en-IN", {
    style: "currency",
    currency: "INR",
    maximumFractionDigits: 0,
  }).format(amount || 0);
};

export const formatTimeAgo = (date) => {
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

export const getGreeting = () => {
  const hour = new Date().getHours();
  if (hour < 12) return "Good morning";
  if (hour < 17) return "Good afternoon";
  return "Good evening";
};

export const getStatusBadge = (status) => {
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

  return {
    className: badges[status] || "badge-info",
    label: labels[status] || status,
  };
};

export const getStatusBadgeStyle = (status) => {
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

export const calculateRevenueData = (completedProjects) => {
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

    if (year === currentYear) {
      monthlyData[monthIndex].total += project.budget || 0;
      monthlyData[monthIndex].paid += project.amountPaid || 0;
      monthlyData[monthIndex].pending +=
        (project.budget || 0) - (project.amountPaid || 0);
      monthlyData[monthIndex].projectCount += 1;
      monthlyData[monthIndex].projects.push(projectData);
    }

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

  const yearlyData = Object.values(yearlyMap).sort((a, b) => a.year - b.year);

  return {
    monthly: monthlyData,
    yearly: yearlyData,
    projects: completedProjects,
  };
};

export const generateActivities = (data, formatTimeAgo) => {
  const acts = [];

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

  data.projects.forEach((project) => {
    const isCompleted = project.status === "completed";

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

  return acts.sort((a, b) => b.sortDate - a.sortDate).slice(0, 15);
};
