const Lead = require("../models/Lead");
const { validationResult } = require("express-validator");

const getLeads = async (req, res, next) => {
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
      limit = 10,
      status,
      source,
      search,
      sortBy = "createdAt",
      sortOrder = "desc",
    } = req.query;

    // ✅ BUILD QUERY PROPERLY
    let query = {};

    // Build organization filter
    if (req.organizationId) {
      query.$or = [
        { organization: req.organizationId },
        { organization: { $exists: false } },
        { organization: null },
      ];
    } else {
      // Fallback to createdBy if no organization
      query.$or = [
        { createdBy: req.user._id },
        { createdBy: { $exists: false } },
        { createdBy: null },
      ];
    }

    // Add additional filters
    if (status) {
      query.status = status;
    }

    if (source) {
      query.source = source;
    }

    if (search) {
      query.$and = [
        {
          $or: [
            { leadName: { $regex: search, $options: "i" } },
            { businessName: { $regex: search, $options: "i" } },
            { email: { $regex: search, $options: "i" } },
            { phone: { $regex: search, $options: "i" } },
            { city: { $regex: search, $options: "i" } },
          ],
        },
      ];
    }

    const skip = (parseInt(page) - 1) * parseInt(limit);
    const sortOptions = { [sortBy]: sortOrder === "desc" ? -1 : 1 };

    const [leads, total] = await Promise.all([
      Lead.find(query)
        .sort(sortOptions)
        .skip(skip)
        .limit(parseInt(limit))
        .populate("assignedTo", "name email")
        .lean(),
      Lead.countDocuments(query),
    ]);

    res.status(200).json({
      success: true,
      data: leads,
      pagination: {
        current: parseInt(page),
        limit: parseInt(limit),
        total,
        pages: Math.ceil(total / parseInt(limit)),
      },
    });
  } catch (error) {
    console.error("❌ getLeads error:", error);
    next(error);
  }
};

const getLead = async (req, res, next) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({
        success: false,
        message: "Validation failed",
        errors: errors.array(),
      });
    }

    const lead = await Lead.findById(req.params.id).populate(
      "assignedTo",
      "name email"
    );

    if (!lead) {
      return res.status(404).json({
        success: false,
        message: "Lead not found",
      });
    }

    // Check access
    const hasAccess =
      !lead.organization ||
      !lead.createdBy ||
      (req.organizationId &&
        lead.organization?.toString() === req.organizationId.toString()) ||
      lead.createdBy?.toString() === req.user._id.toString();

    if (!hasAccess) {
      return res.status(404).json({
        success: false,
        message: "Lead not found",
      });
    }

    res.status(200).json({
      success: true,
      data: lead,
    });
  } catch (error) {
    next(error);
  }
};

const createLead = async (req, res, next) => {
  try {
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

    // Check duplicate
    const duplicateQuery = {
      $or: [{ email: req.body.email.toLowerCase() }, { phone: req.body.phone }],
    };

    if (req.organizationId) {
      duplicateQuery.organization = req.organizationId;
    } else {
      duplicateQuery.createdBy = req.user._id;
    }

    const existingLead = await Lead.findOne(duplicateQuery);

    if (existingLead) {
      const duplicateField =
        existingLead.email === req.body.email.toLowerCase() ? "email" : "phone";
      return res.status(400).json({
        success: false,
        message: `A lead with this ${duplicateField} already exists`,
      });
    }

    const lead = await Lead.create({
      ...req.body,
      createdBy: req.user._id,
      organization: req.organizationId || undefined,
    });

    res.status(201).json({
      success: true,
      message: "Lead created successfully",
      data: lead,
    });
  } catch (error) {
    next(error);
  }
};

const updateLead = async (req, res, next) => {
  try {
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

    const lead = await Lead.findById(req.params.id);

    if (!lead) {
      return res.status(404).json({
        success: false,
        message: "Lead not found",
      });
    }

    // Check access
    const hasAccess =
      !lead.organization ||
      !lead.createdBy ||
      (req.organizationId &&
        lead.organization?.toString() === req.organizationId.toString()) ||
      lead.createdBy?.toString() === req.user._id.toString();

    if (!hasAccess) {
      return res.status(404).json({
        success: false,
        message: "Lead not found",
      });
    }

    if (req.body.email && req.body.email !== lead.email) {
      const existingLead = await Lead.findOne({
        email: req.body.email.toLowerCase(),
        _id: { $ne: req.params.id },
      });
      if (existingLead) {
        return res.status(400).json({
          success: false,
          message: "A lead with this email already exists",
        });
      }
    }

    if (req.body.phone && req.body.phone !== lead.phone) {
      const existingLead = await Lead.findOne({
        phone: req.body.phone,
        _id: { $ne: req.params.id },
      });
      if (existingLead) {
        return res.status(400).json({
          success: false,
          message: "A lead with this phone number already exists",
        });
      }
    }

    const updateData = {
      ...req.body,
      updatedAt: new Date(),
    };

    // Assign to org if public lead
    if (!lead.organization && req.organizationId) {
      updateData.organization = req.organizationId;
    }
    if (!lead.createdBy) {
      updateData.createdBy = req.user._id;
    }

    const updatedLead = await Lead.findByIdAndUpdate(
      req.params.id,
      updateData,
      { new: true, runValidators: true }
    ).populate("assignedTo", "name email");

    res.status(200).json({
      success: true,
      message: "Lead updated successfully",
      data: updatedLead,
    });
  } catch (error) {
    next(error);
  }
};

const deleteLead = async (req, res, next) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({
        success: false,
        message: "Validation failed",
        errors: errors.array(),
      });
    }

    const lead = await Lead.findById(req.params.id);

    if (!lead) {
      return res.status(404).json({
        success: false,
        message: "Lead not found",
      });
    }

    const hasAccess =
      !lead.organization ||
      !lead.createdBy ||
      (req.organizationId &&
        lead.organization?.toString() === req.organizationId.toString()) ||
      lead.createdBy?.toString() === req.user._id.toString();

    if (!hasAccess) {
      return res.status(404).json({
        success: false,
        message: "Lead not found",
      });
    }

    await Lead.findByIdAndDelete(req.params.id);

    res.status(200).json({
      success: true,
      message: "Lead deleted successfully",
    });
  } catch (error) {
    next(error);
  }
};

const updateLeadStatus = async (req, res, next) => {
  try {
    const { status } = req.body;

    if (!status) {
      return res.status(400).json({
        success: false,
        message: "Status is required",
      });
    }

    const validStatuses = [
      "new",
      "contacted",
      "meeting",
      "proposal_pending",
      "proposal_sent",
      "negotiation",
      "closed_won",
      "closed_lost",
    ];

    if (!validStatuses.includes(status)) {
      return res.status(400).json({
        success: false,
        message: "Invalid status",
      });
    }

    const lead = await Lead.findById(req.params.id);

    if (!lead) {
      return res.status(404).json({
        success: false,
        message: "Lead not found",
      });
    }

    const hasAccess =
      !lead.organization ||
      !lead.createdBy ||
      (req.organizationId &&
        lead.organization?.toString() === req.organizationId.toString()) ||
      lead.createdBy?.toString() === req.user._id.toString();

    if (!hasAccess) {
      return res.status(404).json({
        success: false,
        message: "Lead not found",
      });
    }

    // ✅ Auto-set reminder for proposal_pending
    if (status === "proposal_pending" && !lead.reminder?.date) {
      const reminderDate = new Date();
      reminderDate.setHours(reminderDate.getHours() + 24);

      lead.reminder = {
        date: reminderDate,
        note: "⏰ Send proposal within 24 hours for better conversion rate!",
        status: "pending",
        createdAt: new Date(),
        completedAt: null,
      };
    }

    lead.status = status;
    lead.updatedAt = new Date();

    await lead.save();

    const updatedLead = await Lead.findById(req.params.id)
      .populate("assignedTo", "name email")
      .lean();

    res.status(200).json({
      success: true,
      message: "Lead status updated successfully",
      data: updatedLead,
    });
  } catch (error) {
    console.error("❌ updateLeadStatus error:", error);
    next(error);
  }
};
const convertToClient = async (req, res, next) => {
  try {
    const lead = await Lead.findById(req.params.id);

    if (!lead) {
      return res.status(404).json({
        success: false,
        message: "Lead not found",
      });
    }

    const hasAccess =
      !lead.organization ||
      !lead.createdBy ||
      (req.organizationId &&
        lead.organization?.toString() === req.organizationId.toString()) ||
      lead.createdBy?.toString() === req.user._id.toString();

    if (!hasAccess) {
      return res.status(404).json({
        success: false,
        message: "Lead not found",
      });
    }

    if (lead.convertedToClient) {
      return res.status(400).json({
        success: false,
        message: "Lead has already been converted to a client",
      });
    }

    const Client = require("../models/Client");

    const client = await Client.create({
      clientName: lead.leadName,
      businessName: lead.businessName || lead.leadName,
      email: lead.email,
      phone: lead.phone,
      address: { city: lead.city },
      source: lead.source,
      notes: lead.notes,
      createdBy: req.user._id,
      organization: req.organizationId || undefined,
    });

    lead.convertedToClient = true;
    lead.clientId = client._id;
    lead.status = "closed_won";

    if (!lead.organization && req.organizationId) {
      lead.organization = req.organizationId;
    }
    if (!lead.createdBy) {
      lead.createdBy = req.user._id;
    }

    await lead.save();

    res.status(200).json({
      success: true,
      message: "Lead converted to client successfully",
      data: { lead, client },
    });
  } catch (error) {
    next(error);
  }
};

const getLeadStats = async (req, res, next) => {
  try {
    const orgId = req.organizationId;
    const userId = req.user._id;

    const matchQuery = orgId
      ? {
          $or: [
            { organization: orgId },
            { organization: { $exists: false } },
            { organization: null },
          ],
        }
      : {
          $or: [
            { createdBy: userId },
            { createdBy: { $exists: false } },
            { createdBy: null },
          ],
        };

    const [statusCounts, sourceCounts, totalLeads, recentLeads] =
      await Promise.all([
        Lead.aggregate([
          { $match: matchQuery },
          { $group: { _id: "$status", count: { $sum: 1 } } },
        ]),
        Lead.aggregate([
          { $match: matchQuery },
          { $group: { _id: "$source", count: { $sum: 1 } } },
        ]),
        Lead.countDocuments(matchQuery),
        Lead.find(matchQuery).sort({ createdAt: -1 }).limit(5).lean(),
      ]);

    const totalValue = await Lead.aggregate([
      { $match: matchQuery },
      { $group: { _id: null, total: { $sum: "$estimatedValue" } } },
    ]);

    const wonLeads = await Lead.countDocuments({
      ...matchQuery,
      status: "closed_won",
    });

    const conversionRate =
      totalLeads > 0 ? ((wonLeads / totalLeads) * 100).toFixed(2) : 0;

    res.status(200).json({
      success: true,
      data: {
        totalLeads,
        statusCounts: statusCounts.reduce((acc, item) => {
          acc[item._id] = item.count;
          return acc;
        }, {}),
        sourceCounts: sourceCounts.reduce((acc, item) => {
          acc[item._id] = item.count;
          return acc;
        }, {}),
        totalValue: totalValue[0]?.total || 0,
        conversionRate: parseFloat(conversionRate),
        recentLeads,
      },
    });
  } catch (error) {
    next(error);
  }
};

// ✅ FIX: getReminders - Handle undefined organization
const getReminders = async (req, res, next) => {
  try {
    const orgId = req.organizationId || req.organization?._id;
    const userId = req.user._id;

    const today = new Date();
    today.setHours(0, 0, 0, 0);

    const tomorrow = new Date(today);
    tomorrow.setDate(tomorrow.getDate() + 1);

    // ✅ Build query - works with OR without organization
    let matchQuery = {};

    if (orgId) {
      matchQuery = {
        $or: [
          { organization: orgId },
          { organization: { $exists: false } },
          { organization: null },
        ],
      };
    } else {
      matchQuery = {
        $or: [
          { createdBy: userId },
          { createdBy: { $exists: false } },
          { createdBy: null },
        ],
      };
    }

    const query = {
      ...matchQuery,
      "reminder.date": { $lte: tomorrow, $ne: null },
      "reminder.status": "pending",
    };

    const reminders = await Lead.find(query)
      .select("leadName email phone businessName reminder status createdAt")
      .sort({ "reminder.date": 1 })
      .limit(50)
      .lean();

    const categorizedReminders = {
      overdue: [],
      today: [],
      upcoming: [],
    };

    reminders.forEach((lead) => {
      const reminderDate = new Date(lead.reminder.date);
      reminderDate.setHours(0, 0, 0, 0);

      if (reminderDate < today) {
        categorizedReminders.overdue.push(lead);
      } else if (reminderDate.getTime() === today.getTime()) {
        categorizedReminders.today.push(lead);
      } else {
        categorizedReminders.upcoming.push(lead);
      }
    });

    res.status(200).json({
      success: true,
      data: categorizedReminders,
      total:
        categorizedReminders.overdue.length +
        categorizedReminders.today.length +
        categorizedReminders.upcoming.length,
    });
  } catch (error) {
    console.error("❌ getReminders error:", error);
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

// ✅ FIX: getAllReminders
const getAllReminders = async (req, res, next) => {
  try {
    const orgId = req.organizationId || req.organization?._id;
    const userId = req.user._id;
    const { status, startDate, endDate, page = 1, limit = 20 } = req.query;

    let matchQuery = {};

    if (orgId) {
      matchQuery = {
        $or: [
          { organization: orgId },
          { organization: { $exists: false } },
          { organization: null },
        ],
      };
    } else {
      matchQuery = {
        $or: [
          { createdBy: userId },
          { createdBy: { $exists: false } },
          { createdBy: null },
        ],
      };
    }

    const query = {
      ...matchQuery,
      "reminder.date": { $ne: null },
    };

    if (status) {
      query["reminder.status"] = status;
    }

    if (startDate || endDate) {
      if (!query["reminder.date"]) {
        query["reminder.date"] = {};
      }
      if (startDate) {
        query["reminder.date"].$gte = new Date(startDate);
      }
      if (endDate) {
        query["reminder.date"].$lte = new Date(endDate);
      }
    }

    const skip = (parseInt(page) - 1) * parseInt(limit);

    const [reminders, total] = await Promise.all([
      Lead.find(query)
        .select("leadName email phone businessName reminder status createdAt")
        .sort({ "reminder.date": -1 })
        .skip(skip)
        .limit(parseInt(limit))
        .lean(),
      Lead.countDocuments(query),
    ]);

    res.status(200).json({
      success: true,
      data: reminders,
      pagination: {
        current: parseInt(page),
        limit: parseInt(limit),
        total,
        pages: Math.ceil(total / parseInt(limit)),
      },
    });
  } catch (error) {
    console.error("❌ getAllReminders error:", error);
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

// ✅ FIX: getReminderStats
const getReminderStats = async (req, res, next) => {
  try {
    const orgId = req.organizationId || req.organization?._id;
    const userId = req.user._id;

    const today = new Date();
    today.setHours(0, 0, 0, 0);

    let matchQuery = {};

    if (orgId) {
      matchQuery = {
        $or: [
          { organization: orgId },
          { organization: { $exists: false } },
          { organization: null },
        ],
      };
    } else {
      matchQuery = {
        $or: [
          { createdBy: userId },
          { createdBy: { $exists: false } },
          { createdBy: null },
        ],
      };
    }

    const [overdueCount, todayCount, pendingCount, completedCount] =
      await Promise.all([
        Lead.countDocuments({
          ...matchQuery,
          "reminder.date": { $lt: today, $ne: null },
          "reminder.status": "pending",
        }),
        Lead.countDocuments({
          ...matchQuery,
          "reminder.date": {
            $gte: today,
            $lt: new Date(today.getTime() + 24 * 60 * 60 * 1000),
          },
          "reminder.status": "pending",
        }),
        Lead.countDocuments({
          ...matchQuery,
          "reminder.status": "pending",
          "reminder.date": { $ne: null },
        }),
        Lead.countDocuments({
          ...matchQuery,
          "reminder.status": "completed",
        }),
      ]);

    res.status(200).json({
      success: true,
      data: {
        overdue: overdueCount,
        today: todayCount,
        pending: pendingCount,
        completed: completedCount,
        total: overdueCount + todayCount,
      },
    });
  } catch (error) {
    console.error("❌ getReminderStats error:", error);
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

// ✅ FIX: setReminder
const setReminder = async (req, res, next) => {
  try {
    const { id } = req.params;
    const { date, note } = req.body;
    const orgId = req.organizationId || req.organization?._id;
    const userId = req.user._id;

    if (!date) {
      return res.status(400).json({
        success: false,
        message: "Reminder date is required",
      });
    }

    let matchQuery = { _id: id };

    if (orgId) {
      matchQuery.$or = [
        { organization: orgId },
        { organization: { $exists: false } },
        { organization: null },
      ];
    } else {
      matchQuery.$or = [
        { createdBy: userId },
        { createdBy: { $exists: false } },
        { createdBy: null },
      ];
    }

    const lead = await Lead.findOne(matchQuery);

    if (!lead) {
      return res.status(404).json({
        success: false,
        message: "Lead not found",
      });
    }

    lead.reminder = {
      date: new Date(date),
      note: note || "",
      status: "pending",
      createdAt: new Date(),
      completedAt: null,
    };

    // Assign to org/user if public lead
    if (!lead.organization && orgId) {
      lead.organization = orgId;
    }
    if (!lead.createdBy) {
      lead.createdBy = userId;
    }

    await lead.save();

    res.status(200).json({
      success: true,
      message: "Reminder set successfully",
      data: lead,
    });
  } catch (error) {
    console.error("❌ setReminder error:", error);
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

// ✅ FIX: updateReminderStatus
const updateReminderStatus = async (req, res, next) => {
  try {
    const { id } = req.params;
    const { status } = req.body;
    const orgId = req.organizationId || req.organization?._id;
    const userId = req.user._id;

    if (!["pending", "completed", "dismissed"].includes(status)) {
      return res.status(400).json({
        success: false,
        message: "Invalid status. Must be pending, completed, or dismissed",
      });
    }

    let matchQuery = { _id: id };

    if (orgId) {
      matchQuery.$or = [
        { organization: orgId },
        { organization: { $exists: false } },
        { organization: null },
      ];
    } else {
      matchQuery.$or = [
        { createdBy: userId },
        { createdBy: { $exists: false } },
        { createdBy: null },
      ];
    }

    const lead = await Lead.findOne(matchQuery);

    if (!lead) {
      return res.status(404).json({
        success: false,
        message: "Lead not found",
      });
    }

    if (!lead.reminder || !lead.reminder.date) {
      return res.status(400).json({
        success: false,
        message: "No reminder set for this lead",
      });
    }

    lead.reminder.status = status;

    if (status === "completed" || status === "dismissed") {
      lead.reminder.completedAt = new Date();
    } else {
      lead.reminder.completedAt = null;
    }

    await lead.save();

    res.status(200).json({
      success: true,
      message: `Reminder marked as ${status}`,
      data: lead,
    });
  } catch (error) {
    console.error("❌ updateReminderStatus error:", error);
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

// ✅ FIX: deleteReminder
const deleteReminder = async (req, res, next) => {
  try {
    const { id } = req.params;
    const orgId = req.organizationId || req.organization?._id;
    const userId = req.user._id;

    let matchQuery = { _id: id };

    if (orgId) {
      matchQuery.$or = [
        { organization: orgId },
        { organization: { $exists: false } },
        { organization: null },
      ];
    } else {
      matchQuery.$or = [
        { createdBy: userId },
        { createdBy: { $exists: false } },
        { createdBy: null },
      ];
    }

    const lead = await Lead.findOne(matchQuery);

    if (!lead) {
      return res.status(404).json({
        success: false,
        message: "Lead not found",
      });
    }

    lead.reminder = {
      date: null,
      note: "",
      status: "pending",
      createdAt: null,
      completedAt: null,
    };

    await lead.save();

    res.status(200).json({
      success: true,
      message: "Reminder deleted successfully",
      data: lead,
    });
  } catch (error) {
    console.error("❌ deleteReminder error:", error);
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};
module.exports = {
  getLeads,
  getLead,
  createLead,
  updateLead,
  deleteLead,
  updateLeadStatus,
  convertToClient,
  getLeadStats,
  getReminders,
  getAllReminders,
  setReminder,
  updateReminderStatus,
  deleteReminder,
  getReminderStats,
};
