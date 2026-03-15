const mongoose = require("mongoose");

const agreementSchema = new mongoose.Schema(
  {
    agreementNumber: { type: String, unique: true },
    title: {
      type: String,
      required: [true, "Agreement title is required"],
      trim: true,
      maxlength: [200, "Title cannot exceed 200 characters"],
    },
    type: {
      type: String,
      enum: [
        "software_development",
        "maintenance",
        "consulting",
        "nda",
        "custom",
      ],
      default: "software_development",
    },
    client: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Client",
      required: [true, "Client is required"],
    },
    project: { type: mongoose.Schema.Types.ObjectId, ref: "Project" },
    proposal: { type: mongoose.Schema.Types.ObjectId, ref: "Proposal" },

    // Dynamic Fields - UPDATED clientAddress to Object
    dynamicFields: {
      clientName: { type: String, required: true },
      businessName: { type: String },
      // CHANGED: clientAddress is now an Object
      clientAddress: {
        street: { type: String },
        city: { type: String },
        state: { type: String },
        country: { type: String, default: "India" },
        pincode: { type: String },
      },
      clientEmail: { type: String },
      clientPhone: { type: String },
      projectName: { type: String, required: true },
      projectDescription: { type: String },
      price: { type: Number, required: true },
      currency: { type: String, default: "INR" },
      timeline: { type: String, required: true },
      startDate: { type: Date },
      endDate: { type: Date },
      paymentSchedule: [
        {
          milestone: { type: String },
          percentage: { type: Number },
          amount: { type: Number },
          dueDate: { type: String },
        },
      ],
    },
    companyInfo: {
      name: { type: String, default: "Your Agency Name" },
      address: { type: String },
      email: { type: String },
      phone: { type: String },
      website: { type: String },
      gstin: { type: String },
      pan: { type: String },
    },
    sections: {
      scopeOfWork: {
        title: { type: String, default: "Scope of Work" },
        content: { type: String },
        items: [{ type: String }],
      },
      deliverables: {
        title: { type: String, default: "Deliverables" },
        content: { type: String },
        items: [{ type: String }],
      },
      paymentTerms: {
        title: { type: String, default: "Payment Terms" },
        content: { type: String },
      },
      ownership: {
        title: { type: String, default: "Intellectual Property & Ownership" },
        content: { type: String },
      },
      confidentiality: {
        title: { type: String, default: "Confidentiality" },
        content: { type: String },
      },
      warranties: {
        title: { type: String, default: "Warranties & Support" },
        content: { type: String },
      },
      termination: {
        title: { type: String, default: "Termination" },
        content: { type: String },
      },
      liability: {
        title: { type: String, default: "Limitation of Liability" },
        content: { type: String },
      },
      disputeResolution: {
        title: { type: String, default: "Dispute Resolution" },
        content: { type: String },
      },
      generalProvisions: {
        title: { type: String, default: "General Provisions" },
        content: { type: String },
      },
    },
    customSections: [
      {
        title: { type: String },
        content: { type: String },
        order: { type: Number },
      },
    ],
    signatures: {
      company: {
        name: { type: String },
        designation: { type: String },
        date: { type: Date },
        signed: { type: Boolean, default: false },
        signatureImage: { type: String },
      },
      client: {
        name: { type: String },
        designation: { type: String },
        date: { type: Date },
        signed: { type: Boolean, default: false },
        signatureImage: { type: String },
      },
    },
    status: {
      type: String,
      enum: [
        "draft",
        "sent",
        "viewed",
        "signed",
        "active",
        "completed",
        "terminated",
        "expired",
      ],
      default: "draft",
    },
    effectiveDate: { type: Date },
    expiryDate: { type: Date },
    sentAt: { type: Date },
    viewedAt: { type: Date },
    signedAt: { type: Date },
    internalNotes: { type: String },
    template: {
      type: String,
      enum: ["standard", "detailed", "minimal", "custom"],
      default: "standard",
    },
    createdBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
  },
  { timestamps: true }
);

// Generate agreement number - NO next()
agreementSchema.pre("save", async function () {
  if (!this.agreementNumber) {
    const count = await this.constructor.countDocuments();
    const year = new Date().getFullYear();
    this.agreementNumber = `AGR-${year}-${String(count + 1).padStart(4, "0")}`;
  }
});

// Virtual to get full address as string
agreementSchema.virtual("dynamicFields.fullAddress").get(function () {
  const addr = this.dynamicFields?.clientAddress;
  if (!addr) return "";
  return [addr.street, addr.city, addr.state, addr.country, addr.pincode]
    .filter(Boolean)
    .join(", ");
});

// Indexes
agreementSchema.index({ client: 1 });
agreementSchema.index({ status: 1 });
agreementSchema.index({ createdBy: 1 });

const Agreement = mongoose.model("Agreement", agreementSchema);

module.exports = Agreement;
