import { templateTypes, templateCategories } from "../data/placeholders";
export const clientFilterConfig = [
  {
    key: "status",
    type: "select",
    placeholder: "All Status",
    options: [
      { value: "", label: "All Status" },
      { value: "active", label: "Active" },
      { value: "inactive", label: "Inactive" },
      { value: "on_hold", label: "On Hold" },
    ],
  },
  {
    key: "industry",
    type: "select",
    placeholder: "All Industries",
    options: [
      { value: "", label: "All Industries" },
      { value: "Technology", label: "Technology" },
      { value: "E-commerce", label: "E-commerce" },
      { value: "Healthcare", label: "Healthcare" },
      { value: "Finance", label: "Finance" },
      { value: "Education", label: "Education" },
      { value: "Real Estate", label: "Real Estate" },
      { value: "Manufacturing", label: "Manufacturing" },
      { value: "Retail", label: "Retail" },
      { value: "Other", label: "Other" },
    ],
  },
];

export const leadFilterConfig = [
  {
    key: "status",
    type: "select",
    placeholder: "All Status",
    options: [
      { value: "", label: "All Status" },
      { value: "new", label: "New" },
      { value: "contacted", label: "Contacted" },
      { value: "meeting", label: "Meeting" },
      { value: "proposal_sent", label: "Proposal Sent" },
      { value: "negotiation", label: "Negotiation" },
      { value: "closed_won", label: "Won" },
      { value: "closed_lost", label: "Lost" },
    ],
  },
  {
    key: "source",
    type: "select",
    placeholder: "All Sources",
    options: [
      { value: "", label: "All Sources" },
      { value: "website", label: "Website" },
      { value: "website-contact", label: "Website Contact Form" },
      { value: "instagram", label: "Instagram" },
      { value: "referral", label: "Referral" },
      { value: "google", label: "Google" },
      { value: "cold_call", label: "Cold Call" },
      { value: "linkedin", label: "LinkedIn" },
      { value: "facebook", label: "Facebook" },
      { value: "other", label: "Other" },
    ],
  },
];

export const projectFilterConfig = [
  {
    key: "status",
    type: "select",
    placeholder: "All Status",
    options: [
      { value: "", label: "All Status" },
      { value: "planning", label: "Planning" },
      { value: "design", label: "Design" },
      { value: "development", label: "Development" },
      { value: "testing", label: "Testing" },
      { value: "review", label: "Review" },
      { value: "completed", label: "Completed" },
      { value: "on_hold", label: "On Hold" },
      { value: "cancelled", label: "Cancelled" },
    ],
  },
  {
    key: "projectType",
    type: "select",
    placeholder: "All Types",
    options: [
      { value: "", label: "All Types" },
      { value: "website", label: "Website" },
      { value: "webapp", label: "Web App" },
      { value: "mobileapp", label: "Mobile App" },
      { value: "ecommerce", label: "E-commerce" },
      { value: "custom", label: "Custom" },
    ],
  },
  {
    key: "priority",
    type: "select",
    placeholder: "All Priorities",
    options: [
      { value: "", label: "All Priorities" },
      { value: "low", label: "Low" },
      { value: "medium", label: "Medium" },
      { value: "high", label: "High" },
      { value: "urgent", label: "Urgent" },
    ],
  },
];

export const invoiceFilterConfig = [
  {
    key: "status",
    type: "select",
    placeholder: "All Status",
    options: [
      { value: "", label: "All Status" },
      { value: "draft", label: "Draft" },
      { value: "sent", label: "Sent" },
      { value: "viewed", label: "Viewed" },
      { value: "paid", label: "Paid" },
      { value: "partial", label: "Partial" },
      { value: "overdue", label: "Overdue" },
      { value: "cancelled", label: "Cancelled" },
    ],
  },
  {
    key: "startDate",
    type: "date",
    placeholder: "Start Date",
  },
  {
    key: "endDate",
    type: "date",
    placeholder: "End Date",
  },
];

export const templateFilterConfig = [
  {
    key: "type",
    type: "select",
    placeholder: "All Types",
    options: [
      { value: "", label: "All Types" },
      ...templateTypes.map((t) => ({ value: t.id, label: t.label })),
    ],
  },
  {
    key: "category",
    type: "select",
    placeholder: "All Categories",
    options: [
      { value: "", label: "All Categories" },
      ...templateCategories.map((c) => ({ value: c.id, label: c.label })),
    ],
  },
];

export const agreementFilterConfig = [
  {
    key: "status",
    type: "select",
    placeholder: "All Status",
    options: [
      { value: "", label: "All Status" },
      { value: "draft", label: "Draft" },
      { value: "sent", label: "Sent" },
      { value: "signed", label: "Signed" },
      { value: "active", label: "Active" },
      { value: "completed", label: "Completed" },
      { value: "terminated", label: "Terminated" },
    ],
  },
  {
    key: "type",
    type: "select",
    placeholder: "All Types",
    options: [
      { value: "", label: "All Types" },
      { value: "software_development", label: "Software Development" },
      { value: "maintenance", label: "Maintenance" },
      { value: "consulting", label: "Consulting" },
      { value: "nda", label: "NDA" },
      { value: "custom", label: "Custom" },
    ],
  },
];

export const proposalFilterConfig = [
  {
    key: "status",
    type: "select",
    placeholder: "All Status",
    options: [
      { value: "", label: "All Status" },
      { value: "draft", label: "Draft" },
      { value: "sent", label: "Sent" },
      { value: "viewed", label: "Viewed" },
      { value: "accepted", label: "Accepted" },
      { value: "rejected", label: "Rejected" },
      { value: "expired", label: "Expired" },
    ],
  },
];
