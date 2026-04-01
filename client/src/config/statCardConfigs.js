export const STAT_ICONS = {
  users:
    "M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0z",
  userGroup:
    "M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197M13 7a4 4 0 11-8 0 4 4 0 018 0z",
  check: "M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z",
  trending: "M13 7h8m0 0v8m0-8l-8 8-4-4-6 6",
  currency:
    "M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z",
  clock: "M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z",
  document:
    "M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z",
  edit: "M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z",
  mail: "M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z",
  shield:
    "M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z",
  warning:
    "M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z",
  folder:
    "M3 7v10a2 2 0 002 2h14a2 2 0 002-2V9a2 2 0 00-2-2h-6l-2-2H5a2 2 0 00-2 2z",
  lightning: "M13 10V3L4 14h7v7l9-11h-7z",
  alertCircle: "M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z",
  clipboard:
    "M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2",
};

export const STAT_COLORS = {
  purple: "from-purple-500 to-pink-500",
  green: "from-neon-green to-neon-blue",
  emerald: "from-green-400 to-emerald-500",
  amber: "from-amber-500 to-orange-500",
  blue: "from-neon-blue to-cyan-400",
  red: "from-red-500 to-rose-500",
  gray: "from-gray-400 to-gray-500",
  neonGreen: "from-neon-green to-emerald-500",
};

export const formatCurrency = (amount) => {
  if (amount === undefined || amount === null) return "₹0";
  return new Intl.NumberFormat("en-IN", {
    style: "currency",
    currency: "INR",
    maximumFractionDigits: 0,
  }).format(amount);
};

export const getLeadStatCards = (stats) => {
  if (!stats) return [];
  return [
    {
      label: "Total Leads",
      value: stats.totalLeads || 0,
      color: STAT_COLORS.purple,
      icon: STAT_ICONS.users,
    },
    {
      label: "Qualified",
      value:
        stats.statusCounts?.qualified || stats.statusCounts?.contacted || 0,
      color: STAT_COLORS.green,
      icon: STAT_ICONS.check,
    },
    {
      label: "Conversion Rate",
      value: `${stats.conversionRate || 0}%`,
      color: STAT_COLORS.amber,
      icon: STAT_ICONS.trending,
    },
    {
      label: "Total Value",
      value: formatCurrency(stats.totalValue || 0),
      color: STAT_COLORS.emerald,
      icon: STAT_ICONS.currency,
    },
  ];
};

export const getClientStatCards = (stats) => {
  if (!stats) return [];
  return [
    {
      label: "Total Clients",
      value: stats.totalClients || 0,
      color: STAT_COLORS.purple,
      icon: STAT_ICONS.userGroup,
    },
    {
      label: "Active Clients",
      value: stats.activeClients || 0,
      color: STAT_COLORS.green,
      icon: STAT_ICONS.check,
    },
    {
      label: "Total Revenue",
      value: formatCurrency(stats.totalRevenue || 0),
      color: STAT_COLORS.emerald,
      icon: STAT_ICONS.currency,
    },
    {
      label: "On Hold",
      value: stats.statusCounts?.on_hold || stats.onHoldClients || 0,
      color: STAT_COLORS.amber,
      icon: STAT_ICONS.clock,
    },
  ];
};

export const getProjectStatCards = (stats) => {
  if (!stats) return [];
  return [
    {
      label: "Total Projects",
      value: stats.totalProjects || 0,
      color: STAT_COLORS.purple,
      icon: STAT_ICONS.folder,
    },
    {
      label: "Active",
      value: stats.activeProjects || 0,
      color: STAT_COLORS.blue,
      icon: STAT_ICONS.lightning,
    },
    {
      label: "Overdue",
      value: stats.overdueProjects || 0,
      color: STAT_COLORS.red,
      icon: STAT_ICONS.alertCircle,
    },
    {
      label: "Total Revenue",
      value: formatCurrency(stats.totalPaid || stats.totalBudget || 0),
      color: STAT_COLORS.emerald,
      icon: STAT_ICONS.currency,
    },
  ];
};

export const getProposalStatCards = (stats) => {
  if (!stats) return [];
  return [
    {
      label: "Total",
      value: stats.totalProposals || 0,
      color: STAT_COLORS.purple,
      icon: STAT_ICONS.clipboard,
    },
    {
      label: "Drafts",
      value: stats.statusCounts?.draft || 0,
      color: STAT_COLORS.gray,
      icon: STAT_ICONS.edit,
    },
    {
      label: "Sent",
      value: stats.statusCounts?.sent || 0,
      color: STAT_COLORS.blue,
      icon: STAT_ICONS.mail,
    },
    {
      label: "Accepted",
      value: stats.statusCounts?.accepted || 0,
      color: STAT_COLORS.neonGreen,
      icon: STAT_ICONS.check,
    },
    {
      label: "Total Value",
      value: formatCurrency(stats.totalAcceptedValue || 0),
      color: STAT_COLORS.amber,
      icon: STAT_ICONS.currency,
    },
  ];
};

export const getAgreementStatCards = (stats) => {
  if (!stats) return [];
  return [
    {
      label: "Total",
      value: stats.totalAgreements || 0,
      color: STAT_COLORS.purple,
      icon: STAT_ICONS.document,
    },
    {
      label: "Drafts",
      value: stats.statusCounts?.draft || 0,
      color: STAT_COLORS.gray,
      icon: STAT_ICONS.edit,
    },
    {
      label: "Sent",
      value: stats.statusCounts?.sent || 0,
      color: STAT_COLORS.blue,
      icon: STAT_ICONS.mail,
    },
    {
      label: "Signed",
      value: stats.statusCounts?.signed || 0,
      color: STAT_COLORS.neonGreen,
      icon: STAT_ICONS.shield,
    },
    {
      label: "Total Value",
      value: formatCurrency(stats.totalContractValue || 0),
      color: STAT_COLORS.amber,
      icon: STAT_ICONS.currency,
    },
  ];
};

export const getInvoiceStatCards = (stats) => {
  if (!stats) return [];
  return [
    {
      label: "Total Invoices",
      value: stats.totalInvoices || 0,
      color: STAT_COLORS.purple,
      icon: STAT_ICONS.document,
    },
    {
      label: "Total Amount",
      value: formatCurrency(stats.totalAmount || stats.totalRevenue || 0),
      color: STAT_COLORS.neonGreen,
      icon: STAT_ICONS.currency,
    },
    {
      label: "Received",
      value: formatCurrency(stats.totalPaid || stats.paidAmount || 0),
      color: STAT_COLORS.blue,
      icon: STAT_ICONS.check,
    },
    {
      label: "Pending",
      value: formatCurrency(stats.totalPending || stats.pendingAmount || 0),
      color: STAT_COLORS.amber,
      icon: STAT_ICONS.clock,
    },
    {
      label: "Overdue",
      value: stats.statusCounts?.overdue || stats.overdueInvoices || 0,
      color: STAT_COLORS.red,
      icon: STAT_ICONS.warning,
    },
  ];
};

export const getTemplateStatCards = (stats) => {
  if (!stats) return [];
  return [
    {
      label: "Total Templates",
      value: stats.totalTemplates || 0,
      color: STAT_COLORS.purple,
      icon: STAT_ICONS.document,
    },
    // {
    //   label: "Proposal",
    //   value: stats.typeCounts?.proposal || 0,
    //   color: STAT_COLORS.blue,
    //   icon: STAT_ICONS.clipboard,
    // },
    // {
    //   label: "Agreement",
    //   value: stats.typeCounts?.agreement || 0,
    //   color: STAT_COLORS.neonGreen,
    //   icon: STAT_ICONS.shield,
    // },
    // {
    //   label: "Invoice",
    //   value: stats.typeCounts?.invoice || 0,
    //   color: STAT_COLORS.amber,
    //   icon: STAT_ICONS.currency,
    // },
  ];
};
