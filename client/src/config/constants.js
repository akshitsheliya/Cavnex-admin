export const STATUS_COLORS = {
  // Lead Status
  new: { bg: "bg-blue-500/20", text: "text-blue-400", label: "New" },
  contacted: {
    bg: "bg-yellow-500/20",
    text: "text-yellow-400",
    label: "Contacted",
  },
  qualified: {
    bg: "bg-purple-500/20",
    text: "text-purple-400",
    label: "Qualified",
  },
  proposal: {
    bg: "bg-orange-500/20",
    text: "text-orange-400",
    label: "Proposal",
  },
  negotiation: {
    bg: "bg-pink-500/20",
    text: "text-pink-400",
    label: "Negotiation",
  },
  won: { bg: "bg-neon-green/20", text: "text-neon-green", label: "Won" },
  lost: { bg: "bg-red-500/20", text: "text-red-400", label: "Lost" },

  // Project Status
  draft: { bg: "bg-gray-500/20", text: "text-gray-400", label: "Draft" },
  planning: { bg: "bg-blue-500/20", text: "text-blue-400", label: "Planning" },
  in_progress: {
    bg: "bg-neon-blue/20",
    text: "text-neon-blue",
    label: "In Progress",
  },
  on_hold: {
    bg: "bg-yellow-500/20",
    text: "text-yellow-400",
    label: "On Hold",
  },
  completed: {
    bg: "bg-neon-green/20",
    text: "text-neon-green",
    label: "Completed",
  },
  cancelled: { bg: "bg-red-500/20", text: "text-red-400", label: "Cancelled" },

  // Invoice Status
  sent: { bg: "bg-blue-500/20", text: "text-blue-400", label: "Sent" },
  viewed: { bg: "bg-purple-500/20", text: "text-purple-400", label: "Viewed" },
  paid: { bg: "bg-neon-green/20", text: "text-neon-green", label: "Paid" },
  partial: {
    bg: "bg-orange-500/20",
    text: "text-orange-400",
    label: "Partial",
  },
  overdue: { bg: "bg-red-500/20", text: "text-red-400", label: "Overdue" },
};

export const PRIORITY_OPTIONS = [
  { value: "low", label: "Low", color: "text-gray-400" },
  { value: "medium", label: "Medium", color: "text-yellow-400" },
  { value: "high", label: "High", color: "text-orange-400" },
  { value: "urgent", label: "Urgent", color: "text-red-400" },
];

export const PROJECT_TYPES = [
  { value: "website", label: "Website" },
  { value: "webapp", label: "Web Application" },
  { value: "mobile", label: "Mobile App" },
  { value: "ecommerce", label: "E-Commerce" },
  { value: "design", label: "UI/UX Design" },
  { value: "branding", label: "Branding" },
  { value: "marketing", label: "Digital Marketing" },
  { value: "other", label: "Other" },
];

export const CURRENCY = {
  symbol: "₹",
  code: "INR",
  locale: "en-IN",
};

export const DATE_FORMATS = {
  display: "DD MMM YYYY",
  input: "YYYY-MM-DD",
  full: "DD MMMM YYYY",
  time: "hh:mm A",
  datetime: "DD MMM YYYY hh:mm A",
};

export const PAGINATION = {
  defaultPage: 1,
  defaultLimit: 10,
  limitOptions: [10, 25, 50, 100],
};

export default {
  STATUS_COLORS,
  PRIORITY_OPTIONS,
  PROJECT_TYPES,
  CURRENCY,
  DATE_FORMATS,
  PAGINATION,
};
