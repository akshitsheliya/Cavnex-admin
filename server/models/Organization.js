const mongoose = require("mongoose");

const organizationSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: [true, "Organization name is required"],
      trim: true,
      minlength: [2, "Organization name must be at least 2 characters"],
      maxlength: [100, "Organization name cannot exceed 100 characters"],
    },
    slug: {
      type: String,
      unique: true,
      lowercase: true,
    },
    owner: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: [true, "Organization owner is required"],
    },
    members: [
      {
        user: {
          type: mongoose.Schema.Types.ObjectId,
          ref: "User",
        },
        role: {
          type: String,
          enum: ["owner", "admin", "manager", "member"],
          default: "member",
        },
        joinedAt: {
          type: Date,
          default: Date.now,
        },
      },
    ],
    settings: {
      companyName: { type: String, trim: true },
      companyEmail: { type: String, trim: true },
      companyPhone: { type: String, trim: true },
      companyWebsite: { type: String, trim: true },
      companyAddress: { type: String, trim: true },
      companyLogo: { type: String },
      gstin: { type: String, trim: true },
      pan: { type: String, trim: true },
    },
    isActive: {
      type: Boolean,
      default: true,
    },
  },
  {
    timestamps: true,
  }
);

// Generate slug before saving
organizationSchema.pre("save", async function () {
  if (!this.slug || this.isModified("name")) {
    let baseSlug = this.name
      .toLowerCase()
      .replace(/[^a-z0-9]+/g, "-")
      .replace(/(^-|-$)/g, "");

    let slug = baseSlug;
    let counter = 1;

    while (await this.constructor.findOne({ slug, _id: { $ne: this._id } })) {
      slug = `${baseSlug}-${counter}`;
      counter++;
    }

    this.slug = slug;
  }
});

// Index for faster queries
organizationSchema.index({ owner: 1 });
organizationSchema.index({ "members.user": 1 });
organizationSchema.index({ slug: 1 });

// Check if user is member
organizationSchema.methods.isMember = function (userId) {
  return this.members.some(
    (member) => member.user.toString() === userId.toString()
  );
};

// Check if user is owner
organizationSchema.methods.isOwner = function (userId) {
  return this.owner.toString() === userId.toString();
};

// Add member
organizationSchema.methods.addMember = async function (
  userId,
  role = "member"
) {
  if (!this.isMember(userId)) {
    this.members.push({
      user: userId,
      role: role,
      joinedAt: new Date(),
    });
    await this.save();
  }
  return this;
};

// Remove member
organizationSchema.methods.removeMember = async function (userId) {
  this.members = this.members.filter(
    (member) => member.user.toString() !== userId.toString()
  );
  await this.save();
  return this;
};

// Get member role
organizationSchema.methods.getMemberRole = function (userId) {
  const member = this.members.find(
    (m) => m.user.toString() === userId.toString()
  );
  return member ? member.role : null;
};

const Organization = mongoose.model("Organization", organizationSchema);

module.exports = Organization;
