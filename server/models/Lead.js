const mongoose = require("mongoose");

const leadSchema = new mongoose.Schema(
  {
    leadName: {
      type: String,
      required: [true, "Lead name is required"],
      trim: true,
      minlength: [2, "Lead name must be at least 2 characters"],
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
        "instagram",
        "referral",
        "google",
        "cold_call",
        "linkedin",
        "facebook",
        "other",
      ],
      default: "website",
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
    convertedToClient: {
      type: Boolean,
      default: false,
    },
    clientId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Client",
    },
    createdBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
  },
  {
    timestamps: true,
  }
);

// Indexes
leadSchema.index({ email: 1 });
leadSchema.index({ phone: 1 });
leadSchema.index({ status: 1 });
leadSchema.index({ source: 1 });
leadSchema.index({ createdAt: -1 });
leadSchema.index({ createdBy: 1 });

// Pre save hook - Mongoose 9.x syntax (NO next)
leadSchema.pre("save", function () {
  this.updatedAt = new Date();
});

// Static methods
leadSchema.statics.getStatusCounts = async function (userId) {
  return this.aggregate([
    { $match: { createdBy: userId } },
    { $group: { _id: "$status", count: { $sum: 1 } } },
  ]);
};

leadSchema.statics.getSourceCounts = async function (userId) {
  return this.aggregate([
    { $match: { createdBy: userId } },
    { $group: { _id: "$source", count: { $sum: 1 } } },
  ]);
};

const Lead = mongoose.model("Lead", leadSchema);

module.exports = Lead;
