const Lead = require("../models/Lead");
const { validationResult } = require("express-validator");

// ✅ HELPER: Build organization/user query
const buildOrgQuery = (req) => {
  // If organization exists, filter by organization (all org members see same data)
  // Otherwise, fall back to createdBy (backward compatibility)
  if (req.organizationId) {
    return { organization: req.organizationId };
  }
  return { createdBy: req.user._id };
};

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

    // ✅ UPDATED: Use organization-based query
    const query = buildOrgQuery(req);

    if (status) {
      query.status = status;
    }

    if (source) {
      query.source = source;
    }

    if (search) {
      query.$or = [
        { leadName: { $regex: search, $options: "i" } },
        { businessName: { $regex: search, $options: "i" } },
        { email: { $regex: search, $options: "i" } },
        { phone: { $regex: search, $options: "i" } },
        { city: { $regex: search, $options: "i" } },
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

    // ✅ UPDATED: Use organization-based query
    const query = { _id: req.params.id, ...buildOrgQuery(req) };

    const lead = await Lead.findOne(query).populate("assignedTo", "name email");

    if (!lead) {
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

    // ✅ UPDATED: Check duplicate within organization
    const duplicateQuery = {
      $or: [{ email: req.body.email.toLowerCase() }, { phone: req.body.phone }],
      ...buildOrgQuery(req),
    };

    const existingLead = await Lead.findOne(duplicateQuery);

    if (existingLead) {
      const duplicateField =
        existingLead.email === req.body.email.toLowerCase() ? "email" : "phone";
      return res.status(400).json({
        success: false,
        message: `A lead with this ${duplicateField} already exists`,
      });
    }

    // ✅ UPDATED: Add organization to lead
    const lead = await Lead.create({
      ...req.body,
      createdBy: req.user._id,
      organization: req.organizationId || undefined, // ✅ NEW
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

    // ✅ UPDATED: Use organization-based query
    const query = { _id: req.params.id, ...buildOrgQuery(req) };
    const lead = await Lead.findOne(query);

    if (!lead) {
      return res.status(404).json({
        success: false,
        message: "Lead not found",
      });
    }

    if (req.body.email && req.body.email !== lead.email) {
      const existingLead = await Lead.findOne({
        email: req.body.email.toLowerCase(),
        ...buildOrgQuery(req),
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
        ...buildOrgQuery(req),
        _id: { $ne: req.params.id },
      });
      if (existingLead) {
        return res.status(400).json({
          success: false,
          message: "A lead with this phone number already exists",
        });
      }
    }

    const updatedLead = await Lead.findByIdAndUpdate(
      req.params.id,
      { ...req.body, updatedAt: new Date() },
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

    // ✅ UPDATED: Use organization-based query
    const query = { _id: req.params.id, ...buildOrgQuery(req) };
    const lead = await Lead.findOne(query);

    if (!lead) {
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

    // ✅ UPDATED: Use organization-based query
    const query = { _id: req.params.id, ...buildOrgQuery(req) };

    const lead = await Lead.findOneAndUpdate(
      query,
      { status, updatedAt: new Date() },
      { new: true }
    );

    if (!lead) {
      return res.status(404).json({
        success: false,
        message: "Lead not found",
      });
    }

    res.status(200).json({
      success: true,
      message: "Lead status updated successfully",
      data: lead,
    });
  } catch (error) {
    next(error);
  }
};

const convertToClient = async (req, res, next) => {
  try {
    // ✅ UPDATED: Use organization-based query
    const query = { _id: req.params.id, ...buildOrgQuery(req) };
    const lead = await Lead.findOne(query);

    if (!lead) {
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

    // ✅ UPDATED: Add organization to client
    const client = await Client.create({
      clientName: lead.leadName,
      businessName: lead.businessName || lead.leadName,
      email: lead.email,
      phone: lead.phone,
      address: { city: lead.city },
      source: lead.source,
      notes: lead.notes,
      createdBy: req.user._id,
      organization: req.organizationId || undefined, // ✅ NEW
    });

    lead.convertedToClient = true;
    lead.clientId = client._id;
    lead.status = "closed_won";
    await lead.save();

    res.status(200).json({
      success: true,
      message: "Lead converted to client successfully",
      data: {
        lead,
        client,
      },
    });
  } catch (error) {
    next(error);
  }
};

const getLeadStats = async (req, res, next) => {
  try {
    // ✅ UPDATED: Use organization-based stats
    const orgId = req.organizationId;
    const userId = req.user._id;

    const [statusCounts, sourceCounts, totalLeads, recentLeads] =
      await Promise.all([
        Lead.getStatusCounts(orgId, userId),
        Lead.getSourceCounts(orgId, userId),
        Lead.countDocuments(buildOrgQuery(req)),
        Lead.find(buildOrgQuery(req)).sort({ createdAt: -1 }).limit(5).lean(),
      ]);

    const matchQuery = orgId ? { organization: orgId } : { createdBy: userId };

    const totalValue = await Lead.aggregate([
      { $match: matchQuery },
      { $group: { _id: null, total: { $sum: "$estimatedValue" } } },
    ]);

    const wonLeads = await Lead.countDocuments({
      ...buildOrgQuery(req),
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

module.exports = {
  getLeads,
  getLead,
  createLead,
  updateLead,
  deleteLead,
  updateLeadStatus,
  convertToClient,
  getLeadStats,
};
