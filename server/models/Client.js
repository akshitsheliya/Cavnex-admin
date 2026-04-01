const mongoose = require("mongoose");

const clientSchema = new mongoose.Schema(
  {
    clientName: {
      type: String,
      required: [true, "Client name is required"],
      trim: true,
      maxlength: [100, "Client name cannot exceed 100 characters"],
    },
    businessName: {
      type: String,
      trim: true,
      maxlength: [200, "Business name cannot exceed 200 characters"],
    },
    email: {
      type: String,
      required: [true, "Email is required"],
      lowercase: true,
      trim: true,
    },
    phone: {
      type: String,
      required: [true, "Phone is required"],
      trim: true,
    },
    address: {
      street: String,
      city: String,
      state: String,
      pincode: String,
      country: { type: String, default: "India" },
    },
    industry: {
      type: String,
      trim: true,
    },
    website: {
      type: String,
      trim: true,
    },
    gstNumber: {
      type: String,
      trim: true,
    },
    panNumber: {
      type: String,
      trim: true,
    },
    status: {
      type: String,
      enum: ["active", "inactive", "on_hold"],
      default: "active",
    },
    source: {
      type: String,
      enum: [
        "website",
        "website-contact",
        "instagram",
        "referral",
        "google",
        "cold_call",
        "linkedin",
        "facebook",
        "other",
      ],
    },
    notes: {
      type: String,
      maxlength: [2000, "Notes cannot exceed 2000 characters"],
    },
    totalRevenue: {
      type: Number,
      default: 0,
    },
    projectCount: {
      type: Number,
      default: 0,
    },
    leadId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Lead",
    },
    createdBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
    },
    organization: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Organization",
    },
  },
  {
    timestamps: true,
  }
);

clientSchema.index({ email: 1, organization: 1 });
clientSchema.index({ phone: 1, organization: 1 });
clientSchema.index({ organization: 1, status: 1 });
clientSchema.index({ createdBy: 1 });

clientSchema.statics.getStatusCounts = async function (orgId, userId) {
  const matchQuery = orgId ? { organization: orgId } : { createdBy: userId };

  return this.aggregate([
    { $match: matchQuery },
    { $group: { _id: "$status", count: { $sum: 1 } } },
  ]);
};

clientSchema.statics.getIndustryCounts = async function (orgId, userId) {
  const matchQuery = orgId ? { organization: orgId } : { createdBy: userId };

  return this.aggregate([
    { $match: matchQuery },
    { $match: { industry: { $exists: true, $ne: "" } } },
    { $group: { _id: "$industry", count: { $sum: 1 } } },
  ]);
};

module.exports = mongoose.model("Client", clientSchema);
