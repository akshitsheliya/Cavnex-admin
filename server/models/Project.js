const mongoose = require("mongoose");

const featureSchema = new mongoose.Schema(
  {
    name: { type: String, required: true, trim: true },
    description: { type: String, trim: true },
    status: {
      type: String,
      enum: ["pending", "in_progress", "completed"],
      default: "pending",
    },
    estimatedHours: { type: Number, default: 0 },
    actualHours: { type: Number, default: 0 },
  },
  { _id: true }
);

const milestoneSchema = new mongoose.Schema(
  {
    title: { type: String, required: true, trim: true },
    description: { type: String, trim: true },
    dueDate: { type: Date },
    status: {
      type: String,
      enum: ["pending", "completed"],
      default: "pending",
    },
    completedAt: { type: Date },
  },
  { _id: true }
);

const projectSchema = new mongoose.Schema(
  {
    // ✅ NEW FIELD: Organization reference
    organization: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Organization",
      index: true,
    },
    projectName: {
      type: String,
      required: [true, "Project name is required"],
      trim: true,
      minlength: [2, "Project name must be at least 2 characters"],
      maxlength: [200, "Project name cannot exceed 200 characters"],
    },
    description: {
      type: String,
      trim: true,
      maxlength: [2000, "Description cannot exceed 2000 characters"],
    },
    client: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Client",
      required: [true, "Client is required"],
    },
    projectType: {
      type: String,
      enum: ["website", "webapp", "mobileapp", "ecommerce", "custom"],
      required: [true, "Project type is required"],
    },
    status: {
      type: String,
      enum: [
        "planning",
        "design",
        "development",
        "testing",
        "review",
        "completed",
        "on_hold",
        "cancelled",
      ],
      default: "planning",
    },
    priority: {
      type: String,
      enum: ["low", "medium", "high", "urgent"],
      default: "medium",
    },
    startDate: {
      type: Date,
      required: [true, "Start date is required"],
    },
    deadline: {
      type: Date,
      required: [true, "Deadline is required"],
    },
    completedDate: { type: Date },
    budget: {
      type: Number,
      required: [true, "Budget is required"],
      min: [0, "Budget cannot be negative"],
    },
    amountPaid: {
      type: Number,
      default: 0,
      min: [0, "Amount paid cannot be negative"],
    },
    paymentStatus: {
      type: String,
      enum: ["pending", "partial", "completed"],
      default: "pending",
    },
    progress: {
      type: Number,
      default: 0,
      min: 0,
      max: 100,
    },
    features: [featureSchema],
    milestones: [milestoneSchema],
    technologies: [{ type: String, trim: true }],
    repositoryUrl: { type: String, trim: true },
    liveUrl: { type: String, trim: true },
    stagingUrl: { type: String, trim: true },
    notes: {
      type: String,
      maxlength: [5000, "Notes cannot exceed 5000 characters"],
    },
    attachments: [
      {
        name: String,
        url: String,
        type: String,
        uploadedAt: { type: Date, default: Date.now },
      },
    ],
    team: [
      {
        user: { type: mongoose.Schema.Types.ObjectId, ref: "User" },
        role: { type: String, trim: true },
      },
    ],
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
projectSchema.index({ client: 1 });
projectSchema.index({ status: 1 });
projectSchema.index({ projectType: 1 });
projectSchema.index({ createdBy: 1 });
projectSchema.index({ startDate: 1 });
projectSchema.index({ deadline: 1 });
projectSchema.index({ organization: 1 }); // ✅ NEW INDEX

// Virtuals
projectSchema.virtual("isOverdue").get(function () {
  return (
    this.deadline < new Date() &&
    this.status !== "completed" &&
    this.status !== "cancelled"
  );
});

projectSchema.virtual("daysRemaining").get(function () {
  if (this.status === "completed" || this.status === "cancelled") return 0;
  const today = new Date();
  const deadline = new Date(this.deadline);
  const diffTime = deadline - today;
  return Math.ceil(diffTime / (1000 * 60 * 60 * 24));
});

projectSchema.virtual("balanceAmount").get(function () {
  return this.budget - this.amountPaid;
});

// Pre save - NO next()
projectSchema.pre("save", function () {
  this.updatedAt = new Date();

  if (this.amountPaid >= this.budget) {
    this.paymentStatus = "completed";
  } else if (this.amountPaid > 0) {
    this.paymentStatus = "partial";
  } else {
    this.paymentStatus = "pending";
  }

  if (this.status === "completed" && !this.completedDate) {
    this.completedDate = new Date();
  }
});

// ✅ UPDATED: Static methods to use organizationId
projectSchema.statics.getStatusCounts = async function (
  organizationId,
  userId
) {
  const match = organizationId
    ? { organization: organizationId }
    : { createdBy: userId };
  return this.aggregate([
    { $match: match },
    { $group: { _id: "$status", count: { $sum: 1 } } },
  ]);
};

projectSchema.statics.getTypeCounts = async function (organizationId, userId) {
  const match = organizationId
    ? { organization: organizationId }
    : { createdBy: userId };
  return this.aggregate([
    { $match: match },
    { $group: { _id: "$projectType", count: { $sum: 1 } } },
  ]);
};

projectSchema.statics.getRevenueStats = async function (
  organizationId,
  userId
) {
  const match = organizationId
    ? { organization: organizationId }
    : { createdBy: userId };
  return this.aggregate([
    { $match: match },
    {
      $group: {
        _id: null,
        totalBudget: { $sum: "$budget" },
        totalPaid: { $sum: "$amountPaid" },
        totalProjects: { $sum: 1 },
      },
    },
  ]);
};

// Instance methods
projectSchema.methods.calculateProgress = function () {
  if (this.features.length === 0) return this.progress;
  const completedFeatures = this.features.filter(
    (f) => f.status === "completed"
  ).length;
  return Math.round((completedFeatures / this.features.length) * 100);
};

projectSchema.methods.updateProgress = async function () {
  this.progress = this.calculateProgress();
  await this.save();
};

const Project = mongoose.model("Project", projectSchema);

module.exports = Project;
