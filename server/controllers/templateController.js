const Template = require("../models/Template");
const { validationResult } = require("express-validator");

// Get all templates
const getTemplates = async (req, res, next) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({
        success: false,
        message: "Validation failed",
        errors: errors.array(),
      });
    }

    const {
      page = 1,
      limit = 20,
      type,
      category,
      search,
      tags,
      isActive,
      sortBy = "createdAt",
      sortOrder = "desc",
    } = req.query;

    const query = { createdBy: req.user._id };

    if (type) query.type = type;
    if (category) query.category = category;
    if (isActive !== undefined) query.isActive = isActive === "true";

    if (search) {
      query.$or = [
        { name: { $regex: search, $options: "i" } },
        { description: { $regex: search, $options: "i" } },
        { tags: { $regex: search, $options: "i" } },
      ];
    }

    if (tags) {
      const tagsArray = tags.split(",").map((t) => t.trim());
      query.tags = { $in: tagsArray };
    }

    const skip = (parseInt(page) - 1) * parseInt(limit);
    const sortOptions = { [sortBy]: sortOrder === "desc" ? -1 : 1 };

    const [templates, total] = await Promise.all([
      Template.find(query)
        .sort(sortOptions)
        .skip(skip)
        .limit(parseInt(limit))
        .lean(),
      Template.countDocuments(query),
    ]);

    res.status(200).json({
      success: true,
      data: templates,
      pagination: {
        current: parseInt(page),
        limit: parseInt(limit),
        total,
        pages: Math.ceil(total / parseInt(limit)),
      },
    });
  } catch (error) {
    next(error);
  }
};

// Get single template
const getTemplate = async (req, res, next) => {
  try {
    const template = await Template.findOne({
      _id: req.params.id,
      createdBy: req.user._id,
    });

    if (!template) {
      return res.status(404).json({
        success: false,
        message: "Template not found",
      });
    }

    res.status(200).json({
      success: true,
      data: template,
    });
  } catch (error) {
    next(error);
  }
};

// Get template by slug
const getTemplateBySlug = async (req, res, next) => {
  try {
    const template = await Template.findOne({
      slug: req.params.slug,
      createdBy: req.user._id,
    });

    if (!template) {
      return res.status(404).json({
        success: false,
        message: "Template not found",
      });
    }

    res.status(200).json({
      success: true,
      data: template,
    });
  } catch (error) {
    next(error);
  }
};

// Create template
const createTemplate = async (req, res, next) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({
        success: false,
        message: "Validation failed",
        errors: errors.array(),
      });
    }

    const template = await Template.create({
      ...req.body,
      createdBy: req.user._id,
    });

    // Extract and store placeholders
    const extractedPlaceholders = template.extractPlaceholders();
    if (
      extractedPlaceholders.length > 0 &&
      (!req.body.placeholders || req.body.placeholders.length === 0)
    ) {
      template.placeholders = extractedPlaceholders.map((key) => ({
        key,
        label: key
          .replace(/([A-Z])/g, " $1")
          .replace(/^./, (str) => str.toUpperCase()),
        required: false,
        type: "text",
      }));
      await template.save();
    }

    res.status(201).json({
      success: true,
      message: "Template created successfully",
      data: template,
    });
  } catch (error) {
    next(error);
  }
};

// Update template
const updateTemplate = async (req, res, next) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({
        success: false,
        message: "Validation failed",
        errors: errors.array(),
      });
    }

    const template = await Template.findOne({
      _id: req.params.id,
      createdBy: req.user._id,
    });

    if (!template) {
      return res.status(404).json({
        success: false,
        message: "Template not found",
      });
    }

    // Don't allow editing system templates
    if (template.isSystem) {
      return res.status(400).json({
        success: false,
        message: "Cannot modify system templates",
      });
    }

    const updatedTemplate = await Template.findByIdAndUpdate(
      req.params.id,
      { ...req.body, updatedAt: new Date() },
      { new: true, runValidators: true }
    );

    // Re-extract placeholders if content changed
    if (req.body.content) {
      const extractedPlaceholders = updatedTemplate.extractPlaceholders();
      updatedTemplate.placeholders = extractedPlaceholders.map((key) => {
        const existing = template.placeholders.find((p) => p.key === key);
        return (
          existing || {
            key,
            label: key
              .replace(/([A-Z])/g, " $1")
              .replace(/^./, (str) => str.toUpperCase()),
            required: false,
            type: "text",
          }
        );
      });
      await updatedTemplate.save();
    }

    res.status(200).json({
      success: true,
      message: "Template updated successfully",
      data: updatedTemplate,
    });
  } catch (error) {
    next(error);
  }
};

// Delete template
const deleteTemplate = async (req, res, next) => {
  try {
    const template = await Template.findOne({
      _id: req.params.id,
      createdBy: req.user._id,
    });

    if (!template) {
      return res.status(404).json({
        success: false,
        message: "Template not found",
      });
    }

    // Don't allow deleting system templates
    if (template.isSystem) {
      return res.status(400).json({
        success: false,
        message: "Cannot delete system templates",
      });
    }

    await Template.findByIdAndDelete(req.params.id);

    res.status(200).json({
      success: true,
      message: "Template deleted successfully",
    });
  } catch (error) {
    next(error);
  }
};

// Render template with data
const renderTemplate = async (req, res, next) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({
        success: false,
        message: "Validation failed",
        errors: errors.array(),
      });
    }

    const template = await Template.findOne({
      _id: req.params.id,
      createdBy: req.user._id,
    });

    if (!template) {
      return res.status(404).json({
        success: false,
        message: "Template not found",
      });
    }

    const data = req.body.data || {};

    const rendered = {
      content: template.render(data),
      sections: template.renderSections(data),
      subject: template.subject
        ? template.subject.replace(
            /\{\{(\w+)\}\}/g,
            (match, key) => data[key] || ""
          )
        : null,
    };

    // Increment usage count
    await Template.findByIdAndUpdate(req.params.id, {
      $inc: { usageCount: 1 },
    });

    res.status(200).json({
      success: true,
      data: rendered,
    });
  } catch (error) {
    next(error);
  }
};

// Duplicate template
const duplicateTemplate = async (req, res, next) => {
  try {
    const template = await Template.findOne({
      _id: req.params.id,
      createdBy: req.user._id,
    });

    if (!template) {
      return res.status(404).json({
        success: false,
        message: "Template not found",
      });
    }

    const templateData = template.toObject();
    delete templateData._id;
    delete templateData.slug;
    delete templateData.createdAt;
    delete templateData.updatedAt;

    templateData.name = `${templateData.name} (Copy)`;
    templateData.isSystem = false;
    templateData.usageCount = 0;

    const newTemplate = await Template.create(templateData);

    res.status(201).json({
      success: true,
      message: "Template duplicated successfully",
      data: newTemplate,
    });
  } catch (error) {
    next(error);
  }
};

// Get template statistics
const getTemplateStats = async (req, res, next) => {
  try {
    const userId = req.user._id;

    const [totalTemplates, typeCounts, categoryCounts, mostUsed] =
      await Promise.all([
        Template.countDocuments({ createdBy: userId }),
        Template.aggregate([
          { $match: { createdBy: userId } },
          { $group: { _id: "$type", count: { $sum: 1 } } },
        ]),
        Template.aggregate([
          { $match: { createdBy: userId } },
          { $group: { _id: "$category", count: { $sum: 1 } } },
        ]),
        Template.find({ createdBy: userId })
          .sort({ usageCount: -1 })
          .limit(5)
          .select("name type usageCount")
          .lean(),
      ]);

    res.status(200).json({
      success: true,
      data: {
        totalTemplates,
        typeCounts: typeCounts.reduce((acc, item) => {
          acc[item._id] = item.count;
          return acc;
        }, {}),
        categoryCounts: categoryCounts.reduce((acc, item) => {
          acc[item._id] = item.count;
          return acc;
        }, {}),
        mostUsed,
      },
    });
  } catch (error) {
    next(error);
  }
};

// Get default templates (for seeding)
const getDefaultTemplates = async (req, res, next) => {
  try {
    const defaults = getSystemTemplates();
    res.status(200).json({
      success: true,
      data: defaults,
    });
  } catch (error) {
    next(error);
  }
};

// Seed default templates
const seedDefaultTemplates = async (req, res, next) => {
  try {
    const userId = req.user._id;
    const defaults = getSystemTemplates();

    const templates = [];
    for (const template of defaults) {
      const exists = await Template.findOne({
        slug: template.slug,
        createdBy: userId,
      });

      if (!exists) {
        const newTemplate = await Template.create({
          ...template,
          createdBy: userId,
          isSystem: true,
        });
        templates.push(newTemplate);
      }
    }

    res.status(201).json({
      success: true,
      message: `${templates.length} default templates created`,
      data: templates,
    });
  } catch (error) {
    next(error);
  }
};

// Helper function to get system templates
const getSystemTemplates = () => {
  return [
    {
      name: "Standard Proposal Cover",
      slug: "standard-proposal-cover",
      description: "Professional cover page for proposals",
      type: "proposal",
      category: "cover",
      content: `# Project Proposal

## {{projectName}}

Prepared for: **{{clientName}}**
{{#if businessName}}Company: {{businessName}}{{/if}}

Prepared by: **{{companyName}}**
Date: {{date}}

---

This proposal outlines our approach, timeline, and investment for your project.`,
      placeholders: [
        {
          key: "projectName",
          label: "Project Name",
          required: true,
          type: "text",
        },
        {
          key: "clientName",
          label: "Client Name",
          required: true,
          type: "text",
        },
        {
          key: "businessName",
          label: "Business Name",
          required: false,
          type: "text",
        },
        {
          key: "companyName",
          label: "Your Company Name",
          required: true,
          type: "text",
        },
        { key: "date", label: "Date", required: true, type: "date" },
      ],
      tags: ["proposal", "cover", "standard"],
    },
    {
      name: "Scope of Work Section",
      slug: "scope-of-work-section",
      description: "Standard scope of work template",
      type: "proposal",
      category: "section",
      content: `## Scope of Work

The Developer agrees to design, develop, and deliver the **{{projectName}}** project as described in this proposal.

### What's Included:
{{#each includedItems}}
- {{this}}
{{/each}}

### What's Not Included:
{{#each excludedItems}}
- {{this}}
{{/each}}

### Assumptions:
- Client will provide all necessary content and assets
- Timely feedback from client (within 48 hours)
- Access to required accounts and services`,
      placeholders: [
        {
          key: "projectName",
          label: "Project Name",
          required: true,
          type: "text",
        },
        {
          key: "includedItems",
          label: "Included Items",
          required: false,
          type: "list",
        },
        {
          key: "excludedItems",
          label: "Excluded Items",
          required: false,
          type: "list",
        },
      ],
      tags: ["proposal", "scope", "section"],
    },
    {
      name: "Payment Terms Section",
      slug: "payment-terms-section",
      description: "Standard payment terms template",
      type: "agreement",
      category: "section",
      content: `## Payment Terms

The total project cost is **{{price}}**.

### Payment Schedule:
1. **40%** ({{advanceAmount}}) - Upon project commencement
2. **30%** ({{midAmount}}) - Upon design approval
3. **30%** ({{finalAmount}}) - Upon final delivery

### Payment Methods:
- Bank Transfer (NEFT/RTGS/IMPS)
- UPI Payment
- Cheque

All payments are due within 7 days of invoice date. Late payments may incur a 2% monthly interest charge.`,
      placeholders: [
        {
          key: "price",
          label: "Total Price",
          required: true,
          type: "currency",
        },
        {
          key: "advanceAmount",
          label: "Advance Amount (40%)",
          required: true,
          type: "currency",
        },
        {
          key: "midAmount",
          label: "Mid Amount (30%)",
          required: true,
          type: "currency",
        },
        {
          key: "finalAmount",
          label: "Final Amount (30%)",
          required: true,
          type: "currency",
        },
      ],
      tags: ["agreement", "payment", "terms"],
    },
    {
      name: "Confidentiality Clause",
      slug: "confidentiality-clause",
      description: "Standard confidentiality clause",
      type: "agreement",
      category: "section",
      content: `## Confidentiality

Both parties agree to maintain strict confidentiality regarding all proprietary information, trade secrets, business processes, and technical information disclosed during the course of this engagement.

This includes but is not limited to:
- Business strategies and plans
- Technical specifications and source code
- Customer data and information
- Financial information
- Any other information marked as confidential

This obligation shall survive the termination of this agreement for a period of **{{confidentialityPeriod}}**.`,
      placeholders: [
        {
          key: "confidentialityPeriod",
          label: "Confidentiality Period",
          required: false,
          type: "text",
          defaultValue: "2 years",
        },
      ],
      tags: ["agreement", "legal", "confidentiality"],
    },
    {
      name: "Project Completion Email",
      slug: "project-completion-email",
      description: "Email template for project completion",
      type: "email",
      category: "email",
      subject: "Project Completed: {{projectName}}",
      content: `Dear {{clientName}},

We are pleased to inform you that the **{{projectName}}** project has been completed!

### Project Summary:
- **Project:** {{projectName}}
- **Completion Date:** {{completionDate}}
- **Total Investment:** {{price}}

### Deliverables:
{{deliverables}}

### Next Steps:
1. Review the delivered work
2. Provide feedback within 7 days
3. Final sign-off

Please let us know if you have any questions.

Best regards,
{{senderName}}
{{companyName}}`,
      placeholders: [
        {
          key: "clientName",
          label: "Client Name",
          required: true,
          type: "text",
        },
        {
          key: "projectName",
          label: "Project Name",
          required: true,
          type: "text",
        },
        {
          key: "completionDate",
          label: "Completion Date",
          required: true,
          type: "date",
        },
        {
          key: "price",
          label: "Total Price",
          required: true,
          type: "currency",
        },
        {
          key: "deliverables",
          label: "Deliverables",
          required: false,
          type: "text",
        },
        {
          key: "senderName",
          label: "Sender Name",
          required: true,
          type: "text",
        },
        {
          key: "companyName",
          label: "Company Name",
          required: true,
          type: "text",
        },
      ],
      tags: ["email", "completion", "notification"],
    },
    {
      name: "Invoice Payment Reminder",
      slug: "invoice-payment-reminder",
      description: "Email template for payment reminders",
      type: "email",
      category: "email",
      subject: "Payment Reminder: Invoice {{invoiceNumber}}",
      content: `Dear {{clientName}},

This is a friendly reminder that Invoice **{{invoiceNumber}}** is due for payment.

### Invoice Details:
- **Invoice Number:** {{invoiceNumber}}
- **Amount Due:** {{amountDue}}
- **Due Date:** {{dueDate}}

### Payment Options:
Please make the payment via bank transfer or UPI.

If you have already made the payment, please disregard this email.

Best regards,
{{companyName}}`,
      placeholders: [
        {
          key: "clientName",
          label: "Client Name",
          required: true,
          type: "text",
        },
        {
          key: "invoiceNumber",
          label: "Invoice Number",
          required: true,
          type: "text",
        },
        {
          key: "amountDue",
          label: "Amount Due",
          required: true,
          type: "currency",
        },
        { key: "dueDate", label: "Due Date", required: true, type: "date" },
        {
          key: "companyName",
          label: "Company Name",
          required: true,
          type: "text",
        },
      ],
      tags: ["email", "invoice", "reminder", "payment"],
    },
  ];
};

module.exports = {
  getTemplates,
  getTemplate,
  getTemplateBySlug,
  createTemplate,
  updateTemplate,
  deleteTemplate,
  renderTemplate,
  duplicateTemplate,
  getTemplateStats,
  getDefaultTemplates,
  seedDefaultTemplates,
};
