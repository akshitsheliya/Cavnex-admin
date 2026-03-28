const mongoose = require("mongoose");

const leadSchema = new mongoose.Schema(
  {
    leadName: {
      type: String,
      required: [true, "Lead name is required"],
      trim: true,
      maxlength: [100, "Lead name cannot exceed 100 characters"],
    },
    businessName: {
      type: String,
      trim: true,
      maxlength: [200, "Business name cannot exceed 200 characters"],
    },
    businessType: {
      type: String,
      trim: true,
      maxlength: [100, "Business type cannot exceed 100 characters"],
    },
    phone: {
      type: String,
      required: [true, "Phone number is required"],
      trim: true,
    },
    email: {
      type: String,
      required: [true, "Email is required"],
      trim: true,
      lowercase: true,
    },
    city: {
      type: String,
      trim: true,
      maxlength: [100, "City name cannot exceed 100 characters"],
    },
    source: {
      type: String,
      enum: [
        "website",
        "website-contact", // ✅ NEW SOURCE
        "instagram",
        "referral",
        "google",
        "cold_call",
        "linkedin",
        "facebook",
        "other",
      ],
      default: "other",
    },
    status: {
      type: String,
      enum: [
        "new",
        "contacted",
        "meeting",
        "proposal_sent",
        "negotiation",
        "closed_won",
        "closed_lost",
      ],
      default: "new",
    },
    estimatedValue: {
      type: Number,
      default: 0,
      min: [0, "Estimated value cannot be negative"],
    },
    notes: {
      type: String,
      maxlength: [2000, "Notes cannot exceed 2000 characters"],
    },
    followUpDate: {
      type: Date,
    },
    assignedTo: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
    },
    createdBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      // Not required for public leads
    },
    organization: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Organization",
      // Not required for public leads
    },
    convertedToClient: {
      type: Boolean,
      default: false,
    },
    clientId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Client",
    },
  },
  {
    timestamps: true,
  }
);

// Indexes for better query performance
leadSchema.index({ email: 1 });
leadSchema.index({ phone: 1 });
leadSchema.index({ status: 1 });
leadSchema.index({ source: 1 });
leadSchema.index({ createdAt: -1 });
leadSchema.index({ organization: 1, createdAt: -1 });
leadSchema.index({ source: 1, createdAt: -1 }); // ✅ For public leads query

// Static methods for statistics
leadSchema.statics.getStatusCounts = async function (organizationId, userId) {
  const match = organizationId
    ? { organization: organizationId }
    : userId
      ? { createdBy: userId }
      : {};

  return this.aggregate([
    { $match: match },
    { $group: { _id: "$status", count: { $sum: 1 } } },
  ]);
};

leadSchema.statics.getSourceCounts = async function (organizationId, userId) {
  const match = organizationId
    ? { organization: organizationId }
    : userId
      ? { createdBy: userId }
      : {};

  return this.aggregate([
    { $match: match },
    { $group: { _id: "$source", count: { $sum: 1 } } },
  ]);
};

module.exports = mongoose.model("Lead", leadSchema);
