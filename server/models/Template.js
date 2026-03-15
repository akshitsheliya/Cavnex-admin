const mongoose = require("mongoose");

const templateSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: [true, "Template name is required"],
      trim: true,
      maxlength: [100, "Name cannot exceed 100 characters"],
    },
    slug: { type: String, unique: true, lowercase: true },
    description: {
      type: String,
      trim: true,
      maxlength: [500, "Description cannot exceed 500 characters"],
    },
    type: {
      type: String,
      enum: ["proposal", "agreement", "invoice", "email", "custom"],
      required: [true, "Template type is required"],
    },
    category: {
      type: String,
      enum: ["cover", "section", "terms", "email", "full", "snippet"],
      default: "section",
    },
    content: {
      type: String,
      required: [true, "Template content is required"],
    },
    subject: { type: String, trim: true },
    sections: [
      {
        key: { type: String, required: true },
        title: { type: String, required: true },
        content: { type: String, required: true },
        order: { type: Number, default: 0 },
        editable: { type: Boolean, default: true },
      },
    ],
    placeholders: [
      {
        key: { type: String, required: true },
        label: { type: String, required: true },
        defaultValue: { type: String },
        required: { type: Boolean, default: false },
        type: {
          type: String,
          enum: ["text", "number", "date", "currency", "list"],
          default: "text",
        },
      },
    ],
    styling: {
      fontFamily: { type: String, default: "Arial" },
      primaryColor: { type: String, default: "#00FF88" },
      secondaryColor: { type: String, default: "#00D4FF" },
    },
    isSystem: { type: Boolean, default: false },
    isActive: { type: Boolean, default: true },
    usageCount: { type: Number, default: 0 },
    tags: [{ type: String, trim: true }],
    createdBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
  },
  { timestamps: true }
);

// Generate slug - NO next()
templateSchema.pre("save", async function () {
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

// Methods
templateSchema.methods.extractPlaceholders = function () {
  const regex = /\{\{(\w+)\}\}/g;
  const placeholders = new Set();
  let match;

  while ((match = regex.exec(this.content)) !== null) {
    placeholders.add(match[1]);
  }

  if (this.sections && this.sections.length > 0) {
    this.sections.forEach((section) => {
      const sectionRegex = /\{\{(\w+)\}\}/g;
      while ((match = sectionRegex.exec(section.content)) !== null) {
        placeholders.add(match[1]);
      }
    });
  }

  return Array.from(placeholders);
};

templateSchema.methods.render = function (data = {}) {
  let rendered = this.content;

  Object.keys(data).forEach((key) => {
    const regex = new RegExp(`\\{\\{${key}\\}\\}`, "g");
    rendered = rendered.replace(regex, data[key] || "");
  });

  rendered = rendered.replace(/\{\{\w+\}\}/g, "");
  return rendered;
};

templateSchema.methods.renderSections = function (data = {}) {
  if (!this.sections || this.sections.length === 0) return [];

  return this.sections
    .map((section) => {
      let content = section.content;

      Object.keys(data).forEach((key) => {
        const regex = new RegExp(`\\{\\{${key}\\}\\}`, "g");
        content = content.replace(regex, data[key] || "");
      });

      content = content.replace(/\{\{\w+\}\}/g, "");
      return { ...section.toObject(), content };
    })
    .sort((a, b) => a.order - b.order);
};

// Indexes
templateSchema.index({ type: 1 });
templateSchema.index({ category: 1 });
templateSchema.index({ createdBy: 1 });
templateSchema.index({ tags: 1 });
templateSchema.index({ isActive: 1 });

const Template = mongoose.model("Template", templateSchema);

module.exports = Template;
