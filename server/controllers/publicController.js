const Lead = require("../models/Lead");
const { validationResult } = require("express-validator");
const { sendNewLeadNotification } = require("../services/notificationService");

/**
 * @desc    Create a new lead from public contact form
 * @route   POST /api/public/contact-lead
 * @access  Public
 */
const createContactLead = async (req, res) => {
  try {
    // Validation check
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({
        success: false,
        message: "Validation failed",
        errors: errors.array().map((err) => ({
          field: err.path,
          message: err.msg,
        })),
      });
    }

    const { name, email, phone, message } = req.body;

    // Check for duplicate submission (same email in last 24 hours)
    const oneDayAgo = new Date(Date.now() - 24 * 60 * 60 * 1000);
    const existingLead = await Lead.findOne({
      email: email.toLowerCase(),
      source: "website-contact",
      createdAt: { $gte: oneDayAgo },
    });

    if (existingLead) {
      return res.status(429).json({
        success: false,
        message:
          "You have already submitted a contact request recently. We will get back to you soon!",
      });
    }

    // Create lead data
    const leadData = {
      leadName: name.trim(),
      email: email.toLowerCase().trim(),
      phone: phone.trim(),
      notes: message
        ? message.trim()
        : "Contact form submission - No message provided",
      source: "website-contact",
      status: "new",
      businessName: "",
      businessType: "Website Inquiry",
      city: "",
      estimatedValue: 0,
      // Note: No createdBy or organization - this is a public lead
    };

    // Create the lead
    const lead = await Lead.create(leadData);

    // Send email notification (async, don't wait)
    sendNewLeadNotification({
      name: lead.leadName,
      email: lead.email,
      phone: lead.phone,
      message: message || "",
      source: lead.source,
      createdAt: lead.createdAt,
    }).catch((err) => {
      console.error("⚠️ Email notification failed:", err.message);
    });

    // Success response
    res.status(201).json({
      success: true,
      message:
        "Thank you for contacting us! We will get back to you within 24 hours.",
      data: {
        id: lead._id,
        name: lead.leadName,
        email: lead.email,
      },
    });
  } catch (error) {
    console.error("❌ Contact lead creation error:", error);

    // Handle duplicate key error
    if (error.code === 11000) {
      return res.status(400).json({
        success: false,
        message: "A request with this email or phone already exists.",
      });
    }

    res.status(500).json({
      success: false,
      message: "Something went wrong. Please try again later.",
    });
  }
};

/**
 * @desc    Health check for public API
 * @route   GET /api/public/health
 * @access  Public
 */
const healthCheck = (req, res) => {
  res.status(200).json({
    success: true,
    message: "Public API is running",
    timestamp: new Date().toISOString(),
  });
};

module.exports = {
  createContactLead,
  healthCheck,
};
