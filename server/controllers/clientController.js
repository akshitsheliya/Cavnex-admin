const Client = require("../models/Client");
const { validationResult } = require("express-validator");

const getClients = async (req, res, next) => {
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
      industry,
      search,
      sortBy = "createdAt",
      sortOrder = "desc",
    } = req.query;

    const query = { createdBy: req.user._id };

    if (status) {
      query.status = status;
    }

    if (industry) {
      query.industry = industry;
    }

    if (search) {
      query.$or = [
        { clientName: { $regex: search, $options: "i" } },
        { businessName: { $regex: search, $options: "i" } },
        { email: { $regex: search, $options: "i" } },
        { phone: { $regex: search, $options: "i" } },
        { "address.city": { $regex: search, $options: "i" } },
      ];
    }

    const skip = (parseInt(page) - 1) * parseInt(limit);
    const sortOptions = { [sortBy]: sortOrder === "desc" ? -1 : 1 };

    const [clients, total] = await Promise.all([
      Client.find(query)
        .sort(sortOptions)
        .skip(skip)
        .limit(parseInt(limit))
        .lean(),
      Client.countDocuments(query),
    ]);

    res.status(200).json({
      success: true,
      data: clients,
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

const getClient = async (req, res, next) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({
        success: false,
        message: "Validation failed",
        errors: errors.array(),
      });
    }

    const client = await Client.findOne({
      _id: req.params.id,
      createdBy: req.user._id,
    }).populate("leadId", "leadName source");

    if (!client) {
      return res.status(404).json({
        success: false,
        message: "Client not found",
      });
    }

    res.status(200).json({
      success: true,
      data: client,
    });
  } catch (error) {
    next(error);
  }
};

const createClient = async (req, res, next) => {
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

    const existingClient = await Client.findOne({
      $or: [{ email: req.body.email.toLowerCase() }, { phone: req.body.phone }],
      createdBy: req.user._id,
    });

    if (existingClient) {
      const duplicateField =
        existingClient.email === req.body.email.toLowerCase()
          ? "email"
          : "phone";
      return res.status(400).json({
        success: false,
        message: `A client with this ${duplicateField} already exists`,
      });
    }

    const client = await Client.create({
      ...req.body,
      createdBy: req.user._id,
    });

    res.status(201).json({
      success: true,
      message: "Client created successfully",
      data: client,
    });
  } catch (error) {
    next(error);
  }
};

const updateClient = async (req, res, next) => {
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

    const client = await Client.findOne({
      _id: req.params.id,
      createdBy: req.user._id,
    });

    if (!client) {
      return res.status(404).json({
        success: false,
        message: "Client not found",
      });
    }

    if (req.body.email && req.body.email !== client.email) {
      const existingClient = await Client.findOne({
        email: req.body.email.toLowerCase(),
        createdBy: req.user._id,
        _id: { $ne: req.params.id },
      });
      if (existingClient) {
        return res.status(400).json({
          success: false,
          message: "A client with this email already exists",
        });
      }
    }

    if (req.body.phone && req.body.phone !== client.phone) {
      const existingClient = await Client.findOne({
        phone: req.body.phone,
        createdBy: req.user._id,
        _id: { $ne: req.params.id },
      });
      if (existingClient) {
        return res.status(400).json({
          success: false,
          message: "A client with this phone number already exists",
        });
      }
    }

    const updatedClient = await Client.findByIdAndUpdate(
      req.params.id,
      { ...req.body, updatedAt: new Date() },
      { new: true, runValidators: true }
    );

    res.status(200).json({
      success: true,
      message: "Client updated successfully",
      data: updatedClient,
    });
  } catch (error) {
    next(error);
  }
};

const deleteClient = async (req, res, next) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({
        success: false,
        message: "Validation failed",
        errors: errors.array(),
      });
    }

    const client = await Client.findOne({
      _id: req.params.id,
      createdBy: req.user._id,
    });

    if (!client) {
      return res.status(404).json({
        success: false,
        message: "Client not found",
      });
    }

    await Client.findByIdAndDelete(req.params.id);

    res.status(200).json({
      success: true,
      message: "Client deleted successfully",
    });
  } catch (error) {
    next(error);
  }
};

const updateClientStatus = async (req, res, next) => {
  try {
    const { status } = req.body;

    if (!status) {
      return res.status(400).json({
        success: false,
        message: "Status is required",
      });
    }

    const validStatuses = ["active", "inactive", "on_hold"];
    if (!validStatuses.includes(status)) {
      return res.status(400).json({
        success: false,
        message: "Invalid status",
      });
    }

    const client = await Client.findOneAndUpdate(
      { _id: req.params.id, createdBy: req.user._id },
      { status, updatedAt: new Date() },
      { new: true }
    );

    if (!client) {
      return res.status(404).json({
        success: false,
        message: "Client not found",
      });
    }

    res.status(200).json({
      success: true,
      message: "Client status updated successfully",
      data: client,
    });
  } catch (error) {
    next(error);
  }
};

const getClientProjects = async (req, res, next) => {
  try {
    const client = await Client.findOne({
      _id: req.params.id,
      createdBy: req.user._id,
    });

    if (!client) {
      return res.status(404).json({
        success: false,
        message: "Client not found",
      });
    }

    const Project = require("../models/Project");
    const projects = await Project.find({ client: req.params.id })
      .sort({ createdAt: -1 })
      .lean();

    res.status(200).json({
      success: true,
      data: projects,
    });
  } catch (error) {
    next(error);
  }
};

const getClientInvoices = async (req, res, next) => {
  try {
    const client = await Client.findOne({
      _id: req.params.id,
      createdBy: req.user._id,
    });

    if (!client) {
      return res.status(404).json({
        success: false,
        message: "Client not found",
      });
    }

    const Invoice = require("../models/Invoice");
    const invoices = await Invoice.find({ client: req.params.id })
      .sort({ createdAt: -1 })
      .lean();

    res.status(200).json({
      success: true,
      data: invoices,
    });
  } catch (error) {
    next(error);
  }
};

const getClientProposals = async (req, res, next) => {
  try {
    const client = await Client.findOne({
      _id: req.params.id,
      createdBy: req.user._id,
    });

    if (!client) {
      return res.status(404).json({
        success: false,
        message: "Client not found",
      });
    }

    const Proposal = require("../models/Proposal");
    const proposals = await Proposal.find({ client: req.params.id })
      .sort({ createdAt: -1 })
      .lean();

    res.status(200).json({
      success: true,
      data: proposals,
    });
  } catch (error) {
    next(error);
  }
};

const getClientStats = async (req, res, next) => {
  try {
    const userId = req.user._id;

    const [
      statusCounts,
      industryCounts,
      totalClients,
      recentClients,
      totalRevenue,
    ] = await Promise.all([
      Client.getStatusCounts(userId),
      Client.getIndustryCounts(userId),
      Client.countDocuments({ createdBy: userId }),
      Client.find({ createdBy: userId })
        .sort({ createdAt: -1 })
        .limit(5)
        .lean(),
      Client.aggregate([
        { $match: { createdBy: userId } },
        { $group: { _id: null, total: { $sum: "$totalRevenue" } } },
      ]),
    ]);

    const activeClients = await Client.countDocuments({
      createdBy: userId,
      status: "active",
    });

    res.status(200).json({
      success: true,
      data: {
        totalClients,
        activeClients,
        statusCounts: statusCounts.reduce((acc, item) => {
          acc[item._id] = item.count;
          return acc;
        }, {}),
        industryCounts: industryCounts.reduce((acc, item) => {
          acc[item._id] = item.count;
          return acc;
        }, {}),
        totalRevenue: totalRevenue[0]?.total || 0,
        recentClients,
      },
    });
  } catch (error) {
    next(error);
  }
};

module.exports = {
  getClients,
  getClient,
  createClient,
  updateClient,
  deleteClient,
  updateClientStatus,
  getClientProjects,
  getClientInvoices,
  getClientProposals,
  getClientStats,
};
