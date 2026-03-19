export const agreementTypes = [
  { id: "software_development", name: "Software Development", icon: "💻" },
  { id: "maintenance", name: "Maintenance", icon: "🔧" },
  { id: "consulting", name: "Consulting", icon: "💼" },
  { id: "nda", name: "NDA", icon: "🔒" },
  { id: "custom", name: "Custom", icon: "📝" },
];

export const defaultCompanyInfo = {
  name: "Cavnex",
  address: "",
  email: "info@cavnex.com",
  phone: "+91 9876543210",
  website: "www.cavnex.in",
  gstin: "",
  pan: "",
};

export const getDefaultSections = (dynamicFields = {}) => {
  return {
    scopeOfWork: {
      title: "Scope of Work",
      content: `The Developer agrees to design, develop, and deliver the ${dynamicFields.projectName || "[Project Name]"} project as described in this agreement.`,
      items: [],
    },
    deliverables: {
      title: "Deliverables",
      content: "The following deliverables will be provided:",
      items: ["Complete source code", "Documentation", "Training"],
    },
    paymentTerms: {
      title: "Payment Terms",
      content: `The total project cost is ₹${dynamicFields.price?.toLocaleString() || "0"}. Payment will be made according to the schedule outlined in this agreement.`,
    },
    ownership: {
      title: "Intellectual Property & Ownership",
      content:
        "All intellectual property rights in the work product shall be transferred to the Client upon receipt of full payment.",
    },
    confidentiality: {
      title: "Confidentiality",
      content:
        "Both parties agree to maintain strict confidentiality regarding all proprietary information shared during this engagement.",
    },
    termination: {
      title: "Termination",
      content:
        "Either party may terminate this agreement with 14 days written notice. Client shall pay for all work completed up to the termination date.",
    },
  };
};

export default { agreementTypes, defaultCompanyInfo, getDefaultSections };
