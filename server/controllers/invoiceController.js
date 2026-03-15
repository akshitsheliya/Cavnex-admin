const Invoice = require("../models/Invoice");
const Client = require("../models/Client");
const Project = require("../models/Project");
const { validationResult } = require("express-validator");

// Get all invoices
const getInvoices = async (req, res, next) => {
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
      client,
      project,
      search,
      startDate,
      endDate,
      sortBy = "createdAt",
      sortOrder = "desc",
    } = req.query;

    const query = { createdBy: req.user._id };

    if (status) query.status = status;
    if (client) query.client = client;
    if (project) query.project = project;

    if (search) {
      query.$or = [
        { invoiceNumber: { $regex: search, $options: "i" } },
        { title: { $regex: search, $options: "i" } },
      ];
    }

    if (startDate || endDate) {
      query.invoiceDate = {};
      if (startDate) query.invoiceDate.$gte = new Date(startDate);
      if (endDate) query.invoiceDate.$lte = new Date(endDate);
    }

    const skip = (parseInt(page) - 1) * parseInt(limit);
    const sortOptions = { [sortBy]: sortOrder === "desc" ? -1 : 1 };

    // Update overdue invoices
    await Invoice.updateMany(
      {
        createdBy: req.user._id,
        dueDate: { $lt: new Date() },
        status: { $nin: ["paid", "cancelled", "overdue"] },
      },
      { $set: { status: "overdue" } }
    );

    const [invoices, total] = await Promise.all([
      Invoice.find(query)
        .populate("client", "clientName businessName email")
        .populate("project", "projectName")
        .sort(sortOptions)
        .skip(skip)
        .limit(parseInt(limit))
        .lean(),
      Invoice.countDocuments(query),
    ]);

    res.status(200).json({
      success: true,
      data: invoices,
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

// Get single invoice
const getInvoice = async (req, res, next) => {
  try {
    const invoice = await Invoice.findOne({
      _id: req.params.id,
      createdBy: req.user._id,
    })
      .populate("client")
      .populate("project");

    if (!invoice) {
      return res.status(404).json({
        success: false,
        message: "Invoice not found",
      });
    }

    res.status(200).json({
      success: true,
      data: invoice,
    });
  } catch (error) {
    next(error);
  }
};

// Create invoice
const createInvoice = async (req, res, next) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({
        success: false,
        message: "Validation failed",
        errors: errors.array(),
      });
    }

    // Verify client exists
    const client = await Client.findOne({
      _id: req.body.client,
      createdBy: req.user._id,
    });

    if (!client) {
      return res.status(404).json({
        success: false,
        message: "Client not found",
      });
    }

    // Set billing address from client if not provided
    if (!req.body.billingAddress || !req.body.billingAddress.name) {
      req.body.billingAddress = {
        name: client.clientName,
        company: client.businessName,
        address: client.address,
        email: client.email,
        phone: client.phone,
        gstin: client.gstin,
      };
    }

    const invoice = await Invoice.create({
      ...req.body,
      createdBy: req.user._id,
    });

    const populatedInvoice = await Invoice.findById(invoice._id)
      .populate("client", "clientName businessName email")
      .populate("project", "projectName");

    res.status(201).json({
      success: true,
      message: "Invoice created successfully",
      data: populatedInvoice,
    });
  } catch (error) {
    next(error);
  }
};

// Update invoice
const updateInvoice = async (req, res, next) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({
        success: false,
        message: "Validation failed",
        errors: errors.array(),
      });
    }

    const invoice = await Invoice.findOne({
      _id: req.params.id,
      createdBy: req.user._id,
    });

    if (!invoice) {
      return res.status(404).json({
        success: false,
        message: "Invoice not found",
      });
    }

    // Don't allow updates to paid invoices (except status)
    if (
      invoice.status === "paid" &&
      Object.keys(req.body).some(
        (key) => key !== "status" && key !== "internalNotes"
      )
    ) {
      return res.status(400).json({
        success: false,
        message: "Cannot modify paid invoices",
      });
    }

    const updatedInvoice = await Invoice.findByIdAndUpdate(
      req.params.id,
      { ...req.body, updatedAt: new Date() },
      { new: true, runValidators: true }
    )
      .populate("client", "clientName businessName email")
      .populate("project", "projectName");

    res.status(200).json({
      success: true,
      message: "Invoice updated successfully",
      data: updatedInvoice,
    });
  } catch (error) {
    next(error);
  }
};

// Delete invoice
const deleteInvoice = async (req, res, next) => {
  try {
    const invoice = await Invoice.findOne({
      _id: req.params.id,
      createdBy: req.user._id,
    });

    if (!invoice) {
      return res.status(404).json({
        success: false,
        message: "Invoice not found",
      });
    }

    // Don't allow deletion of paid invoices
    if (invoice.status === "paid") {
      return res.status(400).json({
        success: false,
        message: "Cannot delete paid invoices",
      });
    }

    await Invoice.findByIdAndDelete(req.params.id);

    res.status(200).json({
      success: true,
      message: "Invoice deleted successfully",
    });
  } catch (error) {
    next(error);
  }
};

// Update invoice status
const updateInvoiceStatus = async (req, res, next) => {
  try {
    const { status } = req.body;

    if (!status) {
      return res.status(400).json({
        success: false,
        message: "Status is required",
      });
    }

    const validStatuses = [
      "draft",
      "sent",
      "viewed",
      "paid",
      "partial",
      "overdue",
      "cancelled",
    ];
    if (!validStatuses.includes(status)) {
      return res.status(400).json({
        success: false,
        message: "Invalid status",
      });
    }

    const updateData = { status, updatedAt: new Date() };

    // Set timestamps based on status
    switch (status) {
      case "sent":
        updateData.sentAt = new Date();
        break;
      case "viewed":
        updateData.viewedAt = new Date();
        break;
      case "paid":
        updateData.paidAt = new Date();
        break;
    }

    const invoice = await Invoice.findOneAndUpdate(
      { _id: req.params.id, createdBy: req.user._id },
      updateData,
      { new: true }
    ).populate("client", "clientName businessName email");

    if (!invoice) {
      return res.status(404).json({
        success: false,
        message: "Invoice not found",
      });
    }

    res.status(200).json({
      success: true,
      message: "Invoice status updated successfully",
      data: invoice,
    });
  } catch (error) {
    next(error);
  }
};

// Record payment
const recordPayment = async (req, res, next) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({
        success: false,
        message: "Validation failed",
        errors: errors.array(),
      });
    }

    const { amount, paymentMethod, paymentDate, paymentReference } = req.body;

    const invoice = await Invoice.findOne({
      _id: req.params.id,
      createdBy: req.user._id,
    });

    if (!invoice) {
      return res.status(404).json({
        success: false,
        message: "Invoice not found",
      });
    }

    if (invoice.status === "paid") {
      return res.status(400).json({
        success: false,
        message: "Invoice is already paid",
      });
    }

    if (invoice.status === "cancelled") {
      return res.status(400).json({
        success: false,
        message: "Cannot record payment for cancelled invoice",
      });
    }

    // Update payment info
    invoice.amountPaid += amount;
    invoice.paymentMethod = paymentMethod || invoice.paymentMethod;
    invoice.paymentDate = paymentDate || new Date();
    invoice.paymentReference = paymentReference || invoice.paymentReference;

    await invoice.save();

    const updatedInvoice = await Invoice.findById(invoice._id).populate(
      "client",
      "clientName businessName email"
    );

    res.status(200).json({
      success: true,
      message: "Payment recorded successfully",
      data: updatedInvoice,
    });
  } catch (error) {
    next(error);
  }
};

// Duplicate invoice
const duplicateInvoice = async (req, res, next) => {
  try {
    const invoice = await Invoice.findOne({
      _id: req.params.id,
      createdBy: req.user._id,
    });

    if (!invoice) {
      return res.status(404).json({
        success: false,
        message: "Invoice not found",
      });
    }

    const invoiceData = invoice.toObject();
    delete invoiceData._id;
    delete invoiceData.invoiceNumber;
    delete invoiceData.createdAt;
    delete invoiceData.updatedAt;
    delete invoiceData.sentAt;
    delete invoiceData.viewedAt;
    delete invoiceData.paidAt;
    delete invoiceData.paymentDate;
    delete invoiceData.paymentReference;

    invoiceData.status = "draft";
    invoiceData.amountPaid = 0;
    invoiceData.invoiceDate = new Date();

    // Set new due date (30 days from now)
    const dueDate = new Date();
    dueDate.setDate(dueDate.getDate() + 30);
    invoiceData.dueDate = dueDate;

    const newInvoice = await Invoice.create(invoiceData);

    const populatedInvoice = await Invoice.findById(newInvoice._id).populate(
      "client",
      "clientName businessName email"
    );

    res.status(201).json({
      success: true,
      message: "Invoice duplicated successfully",
      data: populatedInvoice,
    });
  } catch (error) {
    next(error);
  }
};

// Get invoice stats
const getInvoiceStats = async (req, res, next) => {
  try {
    const userId = req.user._id;

    const stats = await Invoice.getStats(userId);

    const recentInvoices = await Invoice.find({ createdBy: userId })
      .populate("client", "businessName clientName")
      .sort({ createdAt: -1 })
      .limit(5)
      .lean();

    // Monthly revenue (last 6 months)
    const sixMonthsAgo = new Date();
    sixMonthsAgo.setMonth(sixMonthsAgo.getMonth() - 6);

    const monthlyRevenue = await Invoice.aggregate([
      {
        $match: {
          createdBy: userId,
          status: "paid",
          paidAt: { $gte: sixMonthsAgo },
        },
      },
      {
        $group: {
          _id: {
            year: { $year: "$paidAt" },
            month: { $month: "$paidAt" },
          },
          total: { $sum: "$total" },
          count: { $sum: 1 },
        },
      },
      { $sort: { "_id.year": 1, "_id.month": 1 } },
    ]);

    res.status(200).json({
      success: true,
      data: {
        ...stats,
        recentInvoices,
        monthlyRevenue,
      },
    });
  } catch (error) {
    next(error);
  }
};

// Send invoice (update status to sent)
const sendInvoice = async (req, res, next) => {
  try {
    const invoice = await Invoice.findOneAndUpdate(
      { _id: req.params.id, createdBy: req.user._id },
      {
        status: "sent",
        sentAt: new Date(),
        updatedAt: new Date(),
      },
      { new: true }
    ).populate("client", "clientName businessName email");

    if (!invoice) {
      return res.status(404).json({
        success: false,
        message: "Invoice not found",
      });
    }

    // Here you would send email notification
    // await sendInvoiceEmail(invoice)

    res.status(200).json({
      success: true,
      message: "Invoice sent successfully",
      data: invoice,
    });
  } catch (error) {
    next(error);
  }
};

module.exports = {
  getInvoices,
  getInvoice,
  createInvoice,
  updateInvoice,
  deleteInvoice,
  updateInvoiceStatus,
  recordPayment,
  duplicateInvoice,
  getInvoiceStats,
  sendInvoice,
};
