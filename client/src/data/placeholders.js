// All available placeholders organized by category
export const placeholderCategories = {
  client: {
    label: "Client Information",
    icon: "👤",
    placeholders: [
      { key: "clientName", label: "Client Name", example: "John Doe" },
      { key: "businessName", label: "Business Name", example: "ABC Company" },
      {
        key: "clientEmail",
        label: "Client Email",
        example: "john@example.com",
      },
      { key: "clientPhone", label: "Client Phone", example: "+91 9876543210" },
      {
        key: "clientAddress",
        label: "Client Address",
        example: "123 Main St, City",
      },
      { key: "clientGstin", label: "Client GSTIN", example: "27XXXXXXXXXX1ZX" },
    ],
  },
  project: {
    label: "Project Information",
    icon: "📁",
    placeholders: [
      {
        key: "projectName",
        label: "Project Name",
        example: "Website Redesign",
      },
      {
        key: "projectDescription",
        label: "Project Description",
        example: "Complete website redesign with modern UI",
      },
      { key: "projectType", label: "Project Type", example: "Website" },
      { key: "timeline", label: "Timeline", example: "8-10 weeks" },
      { key: "startDate", label: "Start Date", example: "01 Jan 2024" },
      { key: "endDate", label: "End Date", example: "15 Mar 2024" },
      {
        key: "deliverables",
        label: "Deliverables",
        example: "Website, Documentation",
      },
    ],
  },
  pricing: {
    label: "Pricing Information",
    icon: "💰",
    placeholders: [
      { key: "price", label: "Total Price", example: "₹1,50,000" },
      { key: "subtotal", label: "Subtotal", example: "₹1,27,118" },
      { key: "taxAmount", label: "Tax Amount", example: "₹22,882" },
      { key: "discount", label: "Discount", example: "10%" },
      { key: "discountAmount", label: "Discount Amount", example: "₹15,000" },
      { key: "advanceAmount", label: "Advance Amount", example: "₹60,000" },
      { key: "balanceAmount", label: "Balance Amount", example: "₹90,000" },
    ],
  },
  company: {
    label: "Company Information",
    icon: "🏢",
    placeholders: [
      { key: "companyName", label: "Company Name", example: "Cavnex" },
      {
        key: "companyEmail",
        label: "Company Email",
        example: "info@cavnex.com",
      },
      {
        key: "companyPhone",
        label: "Company Phone",
        example: "+91 9876543210",
      },
      {
        key: "companyAddress",
        label: "Company Address",
        example: "123 Business Street",
      },
      {
        key: "companyWebsite",
        label: "Company Website",
        example: "www.cavnex.in",
      },
      {
        key: "companyGstin",
        label: "Company GSTIN",
        example: "27XXXXXXXXXX1ZX",
      },
      { key: "companyPan", label: "Company PAN", example: "XXXXXXXXXX" },
    ],
  },
  document: {
    label: "Document Information",
    icon: "📄",
    placeholders: [
      {
        key: "documentNumber",
        label: "Document Number",
        example: "PROP-2024-0001",
      },
      {
        key: "invoiceNumber",
        label: "Invoice Number",
        example: "INV-202401-0001",
      },
      {
        key: "proposalNumber",
        label: "Proposal Number",
        example: "PROP-2024-0001",
      },
      {
        key: "agreementNumber",
        label: "Agreement Number",
        example: "AGR-2024-0001",
      },
      { key: "date", label: "Date", example: "15 Jan 2024" },
      { key: "dueDate", label: "Due Date", example: "15 Feb 2024" },
      { key: "validUntil", label: "Valid Until", example: "15 Feb 2024" },
    ],
  },
  dates: {
    label: "Dates",
    icon: "📅",
    placeholders: [
      { key: "currentDate", label: "Current Date", example: "15 Jan 2024" },
      { key: "currentMonth", label: "Current Month", example: "January" },
      { key: "currentYear", label: "Current Year", example: "2024" },
      {
        key: "completionDate",
        label: "Completion Date",
        example: "15 Mar 2024",
      },
    ],
  },
  custom: {
    label: "Custom Fields",
    icon: "⚙️",
    placeholders: [
      { key: "customField1", label: "Custom Field 1", example: "Custom Value" },
      { key: "customField2", label: "Custom Field 2", example: "Custom Value" },
      { key: "customField3", label: "Custom Field 3", example: "Custom Value" },
    ],
  },
};

// Get all placeholders as flat array
export const getAllPlaceholders = () => {
  const all = [];
  Object.values(placeholderCategories).forEach((category) => {
    category.placeholders.forEach((p) => {
      all.push({
        ...p,
        category: category.label,
      });
    });
  });
  return all;
};

// Template types
export const templateTypes = [
  {
    id: "proposal",
    label: "Proposal",
    icon: "📋",
    description: "Proposal templates",
  },
  {
    id: "agreement",
    label: "Agreement",
    icon: "📜",
    description: "Contract and agreement templates",
  },
  {
    id: "invoice",
    label: "Invoice",
    icon: "🧾",
    description: "Invoice templates",
  },
  { id: "email", label: "Email", icon: "📧", description: "Email templates" },
  {
    id: "custom",
    label: "Custom",
    icon: "⚙️",
    description: "Custom templates",
  },
];

// Template categories
export const templateCategories = [
  { id: "cover", label: "Cover Page", icon: "📄" },
  { id: "section", label: "Section", icon: "📑" },
  { id: "terms", label: "Terms & Conditions", icon: "📋" },
  { id: "email", label: "Email", icon: "📧" },
  { id: "full", label: "Full Document", icon: "📃" },
  { id: "snippet", label: "Snippet", icon: "✂️" },
];
