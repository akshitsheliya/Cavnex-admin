const mongoose = require("mongoose");

const invoiceItemSchema = new mongoose.Schema(
  {
    description: {
      type: String,
      required: [true, "Item description is required"],
      trim: true,
    },
    quantity: {
      type: Number,
      required: [true, "Quantity is required"],
      min: [1, "Quantity must be at least 1"],
      default: 1,
    },
    rate: {
      type: Number,
      required: [true, "Rate is required"],
      min: [0, "Rate cannot be negative"],
    },
    amount: { type: Number, default: 0 },
    unit: {
      type: String,
      default: "unit",
      enum: ["unit", "hour", "day", "week", "month", "project", "piece"],
    },
  },
  { _id: true }
);

// Address sub-schema (reusable)
const addressSchema = new mongoose.Schema(
  {
    street: { type: String, trim: true },
    city: { type: String, trim: true },
    state: { type: String, trim: true },
    country: { type: String, trim: true, default: "India" },
    pincode: { type: String, trim: true },
  },
  { _id: false }
);

const invoiceSchema = new mongoose.Schema(
  {
    invoiceNumber: { type: String, unique: true },
    client: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Client",
      required: [true, "Client is required"],
    },
    project: { type: mongoose.Schema.Types.ObjectId, ref: "Project" },
    proposal: { type: mongoose.Schema.Types.ObjectId, ref: "Proposal" },
    title: { type: String, trim: true, default: "Invoice" },
    invoiceDate: { type: Date, default: Date.now },
    dueDate: { type: Date, required: [true, "Due date is required"] },

    // Billing Address - UPDATED to handle both string and object
    billingAddress: {
      name: { type: String },
      company: { type: String },
      // Address can be string OR object
      address: { type: mongoose.Schema.Types.Mixed },
      city: { type: String },
      state: { type: String },
      zipCode: { type: String },
      country: { type: String, default: "India" },
      email: { type: String },
      phone: { type: String },
      gstin: { type: String },
    },

    // Company Info
    companyInfo: {
      name: { type: String, default: "Cavnex" },
      address: { type: mongoose.Schema.Types.Mixed },
      city: { type: String },
      state: { type: String },
      zipCode: { type: String },
      country: { type: String, default: "India" },
      email: { type: String },
      phone: { type: String },
      website: { type: String },
      gstin: { type: String },
      pan: { type: String },
      logo: { type: String },
    },

    items: [invoiceItemSchema],
    subtotal: { type: Number, default: 0 },
    discount: { type: Number, default: 0 },
    discountType: {
      type: String,
      enum: ["percentage", "fixed"],
      default: "percentage",
    },
    discountAmount: { type: Number, default: 0 },
    taxRate: { type: Number, default: 18 },
    taxAmount: { type: Number, default: 0 },
    cgst: { type: Number, default: 0 },
    sgst: { type: Number, default: 0 },
    igst: { type: Number, default: 0 },
    total: { type: Number, default: 0 },
    amountPaid: { type: Number, default: 0 },
    balanceDue: { type: Number, default: 0 },
    currency: { type: String, default: "INR" },
    status: {
      type: String,
      enum: [
        "draft",
        "sent",
        "viewed",
        "paid",
        "partial",
        "overdue",
        "cancelled",
      ],
      default: "draft",
    },
    paymentMethod: {
      type: String,
      enum: ["bank_transfer", "upi", "cheque", "cash", "card", "other"],
      default: "bank_transfer",
    },
    paymentDate: { type: Date },
    paymentReference: { type: String },
    bankDetails: {
      bankName: { type: String },
      accountName: { type: String },
      accountNumber: { type: String },
      ifscCode: { type: String },
      branch: { type: String },
      upiId: { type: String },
    },
    notes: {
      type: String,
      maxlength: [1000, "Notes cannot exceed 1000 characters"],
    },
    terms: {
      type: String,
      maxlength: [2000, "Terms cannot exceed 2000 characters"],
    },
    internalNotes: { type: String },
    sentAt: { type: Date },
    viewedAt: { type: Date },
    paidAt: { type: Date },
    createdBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
  },
  { timestamps: true }
);

// Helper to format address object to string
const formatAddressToString = (address) => {
  if (!address) return "";
  if (typeof address === "string") return address;
  if (typeof address === "object") {
    return [
      address.street,
      address.city,
      address.state,
      address.country,
      address.pincode,
    ]
      .filter(Boolean)
      .join(", ");
  }
  return "";
};

// Pre-save hook - NO next()
invoiceSchema.pre("save", async function () {
  // Generate invoice number
  if (!this.invoiceNumber) {
    const count = await this.constructor.countDocuments();
    const year = new Date().getFullYear();
    const month = String(new Date().getMonth() + 1).padStart(2, "0");
    this.invoiceNumber = `INV-${year}${month}-${String(count + 1).padStart(4, "0")}`;
  }

  // Convert address objects to strings if needed (for PDF generation compatibility)
  // Keep as-is since we're using Mixed type now

  // Calculate item amounts
  if (this.items && this.items.length > 0) {
    this.items.forEach((item) => {
      item.amount = item.quantity * item.rate;
    });

    // Calculate subtotal
    this.subtotal = this.items.reduce((sum, item) => sum + item.amount, 0);
  }

  // Calculate discount
  if (this.discount > 0) {
    if (this.discountType === "percentage") {
      this.discountAmount = this.subtotal * (this.discount / 100);
    } else {
      this.discountAmount = this.discount;
    }
  } else {
    this.discountAmount = 0;
  }

  const afterDiscount = this.subtotal - this.discountAmount;

  // Calculate tax (GST)
  this.taxAmount = afterDiscount * (this.taxRate / 100);
  this.cgst = this.taxAmount / 2;
  this.sgst = this.taxAmount / 2;
  this.igst = 0;

  // Calculate total
  this.total = afterDiscount + this.taxAmount;
  this.balanceDue = this.total - this.amountPaid;

  // Update status based on payment
  if (this.amountPaid >= this.total && this.total > 0) {
    this.status = "paid";
    if (!this.paidAt) this.paidAt = new Date();
  } else if (this.amountPaid > 0) {
    this.status = "partial";
  }

  // Check if overdue
  if (
    this.dueDate < new Date() &&
    this.status !== "paid" &&
    this.status !== "cancelled"
  ) {
    this.status = "overdue";
  }
});

// Virtual to get formatted billing address
invoiceSchema.virtual("formattedBillingAddress").get(function () {
  return formatAddressToString(this.billingAddress?.address);
});

// Virtual to get formatted company address
invoiceSchema.virtual("formattedCompanyAddress").get(function () {
  return formatAddressToString(this.companyInfo?.address);
});

// Indexes
invoiceSchema.index({ client: 1 });
invoiceSchema.index({ status: 1 });
invoiceSchema.index({ createdBy: 1 });
invoiceSchema.index({ dueDate: 1 });
invoiceSchema.index({ invoiceDate: 1 });

// Static methods
invoiceSchema.statics.getStats = async function (userId) {
  const stats = await this.aggregate([
    { $match: { createdBy: userId } },
    {
      $group: {
        _id: null,
        totalInvoices: { $sum: 1 },
        totalAmount: { $sum: "$total" },
        totalPaid: { $sum: "$amountPaid" },
        totalPending: { $sum: "$balanceDue" },
      },
    },
  ]);

  const statusCounts = await this.aggregate([
    { $match: { createdBy: userId } },
    { $group: { _id: "$status", count: { $sum: 1 } } },
  ]);

  return {
    ...(stats[0] || {
      totalInvoices: 0,
      totalAmount: 0,
      totalPaid: 0,
      totalPending: 0,
    }),
    statusCounts: statusCounts.reduce((acc, item) => {
      acc[item._id] = item.count;
      return acc;
    }, {}),
  };
};

const Invoice = mongoose.model("Invoice", invoiceSchema);

module.exports = Invoice;
