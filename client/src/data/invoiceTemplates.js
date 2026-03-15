export const defaultCompanyInfo = {
  name: "Your Agency Name",
  address: "123 Business Street",
  city: "Mumbai",
  state: "Maharashtra",
  zipCode: "400001",
  country: "India",
  email: "contact@youragency.com",
  phone: "+91 9876543210",
  website: "www.youragency.com",
  gstin: "27XXXXXXXXXX1ZX",
  pan: "XXXXXXXXXX",
};

export const defaultBankDetails = {
  bankName: "Your Bank Name",
  accountName: "Your Agency Name",
  accountNumber: "XXXXXXXXXXXX",
  ifscCode: "XXXXXXXXXX",
  branch: "Branch Name",
  upiId: "youragency@upi",
};

export const defaultTerms = `1. Payment is due within 30 days of invoice date.
2. Late payments may incur a 2% monthly interest charge.
3. All amounts are in Indian Rupees (INR).
4. This invoice is computer generated and does not require a signature.
5. Please include the invoice number in your payment reference.`;

export const defaultNotes = `Thank you for your business!

For any queries regarding this invoice, please contact us at accounts@youragency.com`;

export const paymentMethods = [
  { id: "bank_transfer", label: "Bank Transfer", icon: "🏦" },
  { id: "upi", label: "UPI", icon: "📱" },
  { id: "cheque", label: "Cheque", icon: "📝" },
  { id: "cash", label: "Cash", icon: "💵" },
  { id: "card", label: "Card", icon: "💳" },
  { id: "other", label: "Other", icon: "📋" },
];

export const unitTypes = [
  { id: "unit", label: "Unit" },
  { id: "hour", label: "Hour" },
  { id: "day", label: "Day" },
  { id: "week", label: "Week" },
  { id: "month", label: "Month" },
  { id: "project", label: "Project" },
  { id: "piece", label: "Piece" },
];

export const taxRates = [
  { id: 0, label: "No Tax (0%)" },
  { id: 5, label: "GST 5%" },
  { id: 12, label: "GST 12%" },
  { id: 18, label: "GST 18%" },
  { id: 28, label: "GST 28%" },
];
