const mongoose = require("mongoose");

const featureItemSchema = new mongoose.Schema(
  {
    name: { type: String, required: true },
    description: { type: String },
    price: { type: Number, default: 0 },
    included: { type: Boolean, default: true },
  },
  { _id: true }
);

const milestoneSchema = new mongoose.Schema(
  {
    title: { type: String, required: true },
    description: { type: String },
    duration: { type: String },
    deliverables: [{ type: String }],
    payment: { type: Number, default: 0 },
  },
  { _id: true }
);

const proposalSchema = new mongoose.Schema(
  {
    // ✅ NEW FIELD: Organization reference
    organization: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Organization",
      index: true,
    },
    proposalNumber: { type: String, unique: true },
    title: {
      type: String,
      required: [true, "Proposal title is required"],
      trim: true,
      maxlength: [200, "Title cannot exceed 200 characters"],
    },
    client: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Client",
      required: [true, "Client is required"],
    },
    project: { type: mongoose.Schema.Types.ObjectId, ref: "Project" },
    coverPage: {
      companyName: { type: String, default: "Cavnex" },
      companyLogo: { type: String },
      tagline: { type: String },
      preparedFor: { type: String },
      preparedBy: { type: String },
      date: { type: Date, default: Date.now },
    },
    overview: {
      introduction: { type: String },
      objectives: [{ type: String }],
      challenges: { type: String },
      solution: { type: String },
    },
    scope: {
      included: [{ type: String }],
      excluded: [{ type: String }],
      assumptions: [{ type: String }],
    },
    features: [featureItemSchema],
    projectType: {
      type: String,
      enum: [
        "website",
        "ecommerce",
        "webapp",
        "mobile",
        "enterprise",
        "custom",
      ],
      default: "website",
    },
    timeline: {
      startDate: { type: Date },
      endDate: { type: Date },
      totalDuration: { type: String },
      milestones: [milestoneSchema],
    },
    pricing: {
      basePrice: { type: Number, default: 0 },
      featuresPrice: { type: Number, default: 0 },
      customAddOns: [{ name: { type: String }, price: { type: Number } }],
      discount: { type: Number, default: 0 },
      discountType: {
        type: String,
        enum: ["percentage", "fixed"],
        default: "percentage",
      },
      subtotal: { type: Number, default: 0 },
      tax: { type: Number, default: 18 },
      taxAmount: { type: Number, default: 0 },
      total: { type: Number, default: 0 },
    },
    paymentTerms: {
      terms: [
        {
          milestone: { type: String },
          percentage: { type: Number },
          amount: { type: Number },
          dueDate: { type: String },
        },
      ],
      paymentMethods: [{ type: String }],
      bankDetails: {
        bankName: { type: String },
        accountName: { type: String },
        accountNumber: { type: String },
        ifscCode: { type: String },
      },
      notes: { type: String },
    },
    termsAndConditions: [
      { title: { type: String }, content: { type: String } },
    ],
    status: {
      type: String,
      enum: ["draft", "sent", "viewed", "accepted", "rejected", "expired"],
      default: "draft",
    },
    validUntil: { type: Date },
    sentAt: { type: Date },
    viewedAt: { type: Date },
    acceptedAt: { type: Date },
    rejectedAt: { type: Date },
    rejectionReason: { type: String },
    internalNotes: { type: String },
    clientMessage: { type: String },
    template: {
      type: String,
      enum: ["modern", "classic", "minimal", "corporate"],
      default: "modern",
    },
    createdBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
  },
  { timestamps: true }
);

// ✅ FIXED: Generate unique proposalNumber
proposalSchema.pre("save", async function () {
  // Only generate for new documents
  if (!this.isNew) {
    this.calculatePricing();
    return;
  }

  // Generate proposal number
  if (!this.proposalNumber) {
    const year = new Date().getFullYear();

    // ✅ Find highest number for current year
    const lastProposal = await this.constructor
      .findOne({ proposalNumber: { $regex: `^PROP-${year}-` } })
      .sort({ proposalNumber: -1 })
      .select("proposalNumber")
      .lean();

    let nextNumber = 1;
    if (lastProposal?.proposalNumber) {
      const match = lastProposal.proposalNumber.match(/PROP-\d{4}-(\d+)$/);
      if (match) {
        nextNumber = parseInt(match[1], 10) + 1;
      }
    }

    this.proposalNumber = `PROP-${year}-${String(nextNumber).padStart(4, "0")}`;
  }

  // Calculate pricing
  this.calculatePricing();
});

// ✅ Extract pricing logic
proposalSchema.methods.calculatePricing = function () {
  const pricing = this.pricing;
  let subtotal = pricing.basePrice + pricing.featuresPrice;

  if (pricing.customAddOns && pricing.customAddOns.length > 0) {
    subtotal += pricing.customAddOns.reduce(
      (sum, item) => sum + (item.price || 0),
      0
    );
  }

  let discountAmount = 0;
  if (pricing.discount > 0) {
    if (pricing.discountType === "percentage") {
      discountAmount = subtotal * (pricing.discount / 100);
    } else {
      discountAmount = pricing.discount;
    }
  }

  const afterDiscount = subtotal - discountAmount;
  pricing.taxAmount = afterDiscount * (pricing.tax / 100);
  pricing.subtotal = afterDiscount;
  pricing.total = afterDiscount + pricing.taxAmount;
};

// Indexes
proposalSchema.index({ client: 1 });
proposalSchema.index({ status: 1 });
proposalSchema.index({ createdBy: 1 });
proposalSchema.index({ organization: 1 }); // ✅ NEW INDEX

const Proposal = mongoose.model("Proposal", proposalSchema);

module.exports = Proposal;
