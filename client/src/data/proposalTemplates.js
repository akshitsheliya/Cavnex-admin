export const proposalTemplates = {
  modern: {
    id: "modern",
    name: "Modern",
    description: "Clean and contemporary design",
    primaryColor: "#00FF88",
    secondaryColor: "#00D4FF",
    fontFamily: "Inter",
  },
  classic: {
    id: "classic",
    name: "Classic",
    description: "Traditional professional layout",
    primaryColor: "#3B82F6",
    secondaryColor: "#1E40AF",
    fontFamily: "Georgia",
  },
  minimal: {
    id: "minimal",
    name: "Minimal",
    description: "Simple and elegant",
    primaryColor: "#000000",
    secondaryColor: "#666666",
    fontFamily: "Helvetica",
  },
  corporate: {
    id: "corporate",
    name: "Corporate",
    description: "Formal business style",
    primaryColor: "#1F2937",
    secondaryColor: "#4B5563",
    fontFamily: "Arial",
  },
};

export const defaultTermsAndConditions = [
  {
    title: "Intellectual Property",
    content:
      "All intellectual property rights in the work product shall be transferred to the Client upon receipt of full payment. Until full payment is received, all work product remains the property of the Agency.",
  },
  {
    title: "Payment Terms",
    content:
      "Payments are due according to the milestone schedule outlined in this proposal. Late payments may incur a 2% monthly interest charge. Work may be suspended if payments are more than 15 days overdue.",
  },
  {
    title: "Revisions",
    content:
      "This proposal includes two (2) rounds of revisions at each milestone. Additional revisions will be billed at our standard hourly rate. Major scope changes may require a separate proposal.",
  },
  {
    title: "Timeline",
    content:
      "The timeline outlined in this proposal is an estimate based on the defined scope. Delays caused by client feedback, content delivery, or scope changes may extend the timeline.",
  },
  {
    title: "Confidentiality",
    content:
      "Both parties agree to maintain strict confidentiality regarding all project information, business processes, and proprietary data shared during the course of this engagement.",
  },
  {
    title: "Warranty",
    content:
      "We provide a 30-day warranty period after project completion to fix any bugs or issues. This warranty does not cover new feature requests or changes to the original scope.",
  },
  {
    title: "Cancellation",
    content:
      "Either party may terminate this agreement with 14 days written notice. Client shall pay for all work completed up to the termination date. No refunds will be issued for completed milestones.",
  },
  {
    title: "Limitation of Liability",
    content:
      "Our liability is limited to the total amount paid under this agreement. We are not liable for any indirect, incidental, or consequential damages.",
  },
];

export const defaultPaymentTerms = [
  { milestone: "Project Kickoff", percentage: 40, dueDate: "Upon signing" },
  {
    milestone: "Design Approval",
    percentage: 30,
    dueDate: "After design completion",
  },
  {
    milestone: "Project Completion",
    percentage: 30,
    dueDate: "Upon final delivery",
  },
];

export const defaultPaymentMethods = [
  "Bank Transfer (NEFT/RTGS/IMPS)",
  "UPI Payment",
  "Cheque",
  "Credit/Debit Card",
];

export const defaultBankDetails = {
  bankName: "Your Bank Name",
  accountName: "Your Company Name",
  accountNumber: "XXXXXXXXXXXX",
  ifscCode: "XXXXXXXXXX",
};
