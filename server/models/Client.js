const mongoose = require("mongoose");

const clientSchema = new mongoose.Schema(
  {
    clientName: {
      type: String,
      required: [true, "Client name is required"],
      trim: true,
      minlength: [2, "Client name must be at least 2 characters"],
      maxlength: [100, "Client name cannot exceed 100 characters"],
    },
    businessName: {
      type: String,
      required: [true, "Business name is required"],
      trim: true,
      maxlength: [200, "Business name cannot exceed 200 characters"],
    },
    industry: {
      type: String,
      trim: true,
      maxlength: [100, "Industry cannot exceed 100 characters"],
    },
    email: {
      type: String,
      required: [true, "Email is required"],
      trim: true,
      lowercase: true,
    },
    phone: {
      type: String,
      required: [true, "Phone number is required"],
      trim: true,
    },
    alternatePhone: {
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
      uppercase: true,
    },
    address: {
      street: { type: String, trim: true },
      city: { type: String, trim: true },
      state: { type: String, trim: true },
      country: { type: String, trim: true, default: "India" },
      pincode: { type: String, trim: true },
    },
    contactPerson: {
      name: { type: String, trim: true },
      designation: { type: String, trim: true },
      email: { type: String, trim: true, lowercase: true },
      phone: { type: String, trim: true },
    },
    source: {
      type: String,
      enum: [
        "website",
        "instagram",
        "referral",
        "google",
        "cold_call",
        "linkedin",
        "facebook",
        "lead_conversion",
        "other",
      ],
      default: "other",
    },
    status: {
      type: String,
      enum: ["active", "inactive", "on_hold"],
      default: "active",
    },
    notes: {
      type: String,
      maxlength: [2000, "Notes cannot exceed 2000 characters"],
    },
    tags: [{ type: String, trim: true }],
    totalRevenue: {
      type: Number,
      default: 0,
    },
    totalProjects: {
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
      required: true,
    },
  },
  {
    timestamps: true,
    toJSON: { virtuals: true },
    toObject: { virtuals: true },
  }
);

// Indexes
clientSchema.index({ email: 1 });
clientSchema.index({ phone: 1 });
clientSchema.index({ status: 1 });
clientSchema.index({ businessName: "text", clientName: "text" });
clientSchema.index({ createdBy: 1 });
clientSchema.index({ createdAt: -1 });

// Virtuals
clientSchema.virtual("projects", {
  ref: "Project",
  localField: "_id",
  foreignField: "client",
});

clientSchema.virtual("invoices", {
  ref: "Invoice",
  localField: "_id",
  foreignField: "client",
});

clientSchema.virtual("proposals", {
  ref: "Proposal",
  localField: "_id",
  foreignField: "client",
});

// Pre save - NO next()
clientSchema.pre("save", function () {
  this.updatedAt = new Date();
});

// Static methods
clientSchema.statics.getStatusCounts = async function (userId) {
  return this.aggregate([
    { $match: { createdBy: userId } },
    { $group: { _id: "$status", count: { $sum: 1 } } },
  ]);
};

clientSchema.statics.getIndustryCounts = async function (userId) {
  return this.aggregate([
    { $match: { createdBy: userId, industry: { $ne: null, $ne: "" } } },
    { $group: { _id: "$industry", count: { $sum: 1 } } },
    { $sort: { count: -1 } },
    { $limit: 10 },
  ]);
};

// Instance methods
clientSchema.methods.updateRevenue = async function () {
  const Invoice = mongoose.model("Invoice");
  const result = await Invoice.aggregate([
    { $match: { client: this._id, status: "paid" } },
    { $group: { _id: null, total: { $sum: "$amount" } } },
  ]);
  this.totalRevenue = result[0]?.total || 0;
  await this.save();
};

clientSchema.methods.updateProjectCount = async function () {
  const Project = mongoose.model("Project");
  const count = await Project.countDocuments({ client: this._id });
  this.totalProjects = count;
  await this.save();
};

const Client = mongoose.model("Client", clientSchema);

module.exports = Client;
