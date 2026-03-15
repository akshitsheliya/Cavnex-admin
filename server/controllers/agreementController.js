const Agreement = require("../models/Agreement");
const Client = require("../models/Client");
const { validationResult } = require("express-validator");

// Get all agreements
const getAgreements = async (req, res, next) => {
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
      type,
      search,
      sortBy = "createdAt",
      sortOrder = "desc",
    } = req.query;

    const query = { createdBy: req.user._id };

    if (status) query.status = status;
    if (client) query.client = client;
    if (type) query.type = type;

    if (search) {
      query.$or = [
        { title: { $regex: search, $options: "i" } },
        { agreementNumber: { $regex: search, $options: "i" } },
        { "dynamicFields.clientName": { $regex: search, $options: "i" } },
        { "dynamicFields.projectName": { $regex: search, $options: "i" } },
      ];
    }

    const skip = (parseInt(page) - 1) * parseInt(limit);
    const sortOptions = { [sortBy]: sortOrder === "desc" ? -1 : 1 };

    const [agreements, total] = await Promise.all([
      Agreement.find(query)
        .populate("client", "clientName businessName email")
        .populate("project", "projectName")
        .sort(sortOptions)
        .skip(skip)
        .limit(parseInt(limit))
        .lean(),
      Agreement.countDocuments(query),
    ]);

    res.status(200).json({
      success: true,
      data: agreements,
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

// Get single agreement
const getAgreement = async (req, res, next) => {
  try {
    const agreement = await Agreement.findOne({
      _id: req.params.id,
      createdBy: req.user._id,
    })
      .populate("client")
      .populate("project")
      .populate("proposal");

    if (!agreement) {
      return res.status(404).json({
        success: false,
        message: "Agreement not found",
      });
    }

    res.status(200).json({
      success: true,
      data: agreement,
    });
  } catch (error) {
    next(error);
  }
};

// Create agreement
const createAgreement = async (req, res, next) => {
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
    const clientExists = await Client.findOne({
      _id: req.body.client,
      createdBy: req.user._id,
    });

    if (!clientExists) {
      return res.status(404).json({
        success: false,
        message: "Client not found",
      });
    }

    // Set default sections if not provided
    if (!req.body.sections) {
      req.body.sections = getDefaultSections(req.body.dynamicFields);
    }

    const agreement = await Agreement.create({
      ...req.body,
      createdBy: req.user._id,
    });

    const populatedAgreement = await Agreement.findById(agreement._id).populate(
      "client",
      "clientName businessName email"
    );

    res.status(201).json({
      success: true,
      message: "Agreement created successfully",
      data: populatedAgreement,
    });
  } catch (error) {
    next(error);
  }
};

// Update agreement
const updateAgreement = async (req, res, next) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({
        success: false,
        message: "Validation failed",
        errors: errors.array(),
      });
    }

    const agreement = await Agreement.findOne({
      _id: req.params.id,
      createdBy: req.user._id,
    });

    if (!agreement) {
      return res.status(404).json({
        success: false,
        message: "Agreement not found",
      });
    }

    // Don't allow updates to signed agreements (except status)
    if (
      agreement.status === "signed" &&
      Object.keys(req.body).some((key) => key !== "status")
    ) {
      return res.status(400).json({
        success: false,
        message: "Cannot modify signed agreements",
      });
    }

    const updatedAgreement = await Agreement.findByIdAndUpdate(
      req.params.id,
      { ...req.body, updatedAt: new Date() },
      { new: true, runValidators: true }
    ).populate("client", "clientName businessName email");

    res.status(200).json({
      success: true,
      message: "Agreement updated successfully",
      data: updatedAgreement,
    });
  } catch (error) {
    next(error);
  }
};

// Delete agreement
const deleteAgreement = async (req, res, next) => {
  try {
    const agreement = await Agreement.findOne({
      _id: req.params.id,
      createdBy: req.user._id,
    });

    if (!agreement) {
      return res.status(404).json({
        success: false,
        message: "Agreement not found",
      });
    }

    // Don't allow deletion of signed or active agreements
    if (["signed", "active"].includes(agreement.status)) {
      return res.status(400).json({
        success: false,
        message: "Cannot delete signed or active agreements",
      });
    }

    await Agreement.findByIdAndDelete(req.params.id);

    res.status(200).json({
      success: true,
      message: "Agreement deleted successfully",
    });
  } catch (error) {
    next(error);
  }
};

// Update agreement status
const updateAgreementStatus = async (req, res, next) => {
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
      "signed",
      "active",
      "completed",
      "terminated",
      "expired",
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
      case "signed":
        updateData.signedAt = new Date();
        break;
    }

    const agreement = await Agreement.findOneAndUpdate(
      { _id: req.params.id, createdBy: req.user._id },
      updateData,
      { new: true }
    ).populate("client", "clientName businessName email");

    if (!agreement) {
      return res.status(404).json({
        success: false,
        message: "Agreement not found",
      });
    }

    res.status(200).json({
      success: true,
      message: "Agreement status updated successfully",
      data: agreement,
    });
  } catch (error) {
    next(error);
  }
};

// Duplicate agreement
const duplicateAgreement = async (req, res, next) => {
  try {
    const agreement = await Agreement.findOne({
      _id: req.params.id,
      createdBy: req.user._id,
    });

    if (!agreement) {
      return res.status(404).json({
        success: false,
        message: "Agreement not found",
      });
    }

    const agreementData = agreement.toObject();
    delete agreementData._id;
    delete agreementData.agreementNumber;
    delete agreementData.createdAt;
    delete agreementData.updatedAt;
    delete agreementData.sentAt;
    delete agreementData.viewedAt;
    delete agreementData.signedAt;

    agreementData.title = `${agreementData.title} (Copy)`;
    agreementData.status = "draft";
    agreementData.signatures = {
      company: { signed: false },
      client: { signed: false },
    };

    const newAgreement = await Agreement.create(agreementData);

    const populatedAgreement = await Agreement.findById(
      newAgreement._id
    ).populate("client", "clientName businessName email");

    res.status(201).json({
      success: true,
      message: "Agreement duplicated successfully",
      data: populatedAgreement,
    });
  } catch (error) {
    next(error);
  }
};

// Get agreement stats
const getAgreementStats = async (req, res, next) => {
  try {
    const userId = req.user._id;

    const [totalAgreements, statusCounts, recentAgreements, totalValue] =
      await Promise.all([
        Agreement.countDocuments({ createdBy: userId }),
        Agreement.aggregate([
          { $match: { createdBy: userId } },
          { $group: { _id: "$status", count: { $sum: 1 } } },
        ]),
        Agreement.find({ createdBy: userId })
          .populate("client", "businessName")
          .sort({ createdAt: -1 })
          .limit(5)
          .lean(),
        Agreement.aggregate([
          {
            $match: {
              createdBy: userId,
              status: { $in: ["signed", "active", "completed"] },
            },
          },
          { $group: { _id: null, total: { $sum: "$dynamicFields.price" } } },
        ]),
      ]);

    res.status(200).json({
      success: true,
      data: {
        totalAgreements,
        statusCounts: statusCounts.reduce((acc, item) => {
          acc[item._id] = item.count;
          return acc;
        }, {}),
        recentAgreements,
        totalContractValue: totalValue[0]?.total || 0,
      },
    });
  } catch (error) {
    next(error);
  }
};

// Helper function to get default sections
const getDefaultSections = (dynamicFields) => {
  const formatCurrency = (amount) => {
    return new Intl.NumberFormat("en-IN", {
      style: "currency",
      currency: dynamicFields.currency || "INR",
      maximumFractionDigits: 0,
    }).format(amount || 0);
  };

  return {
    scopeOfWork: {
      title: "Scope of Work",
      content: `The Developer agrees to design, develop, and deliver the ${dynamicFields.projectName} project as described in this agreement. The scope includes all features, functionalities, and deliverables as mutually agreed upon by both parties.`,
      items: [],
    },
    deliverables: {
      title: "Deliverables",
      content: "The Developer shall provide the following deliverables:",
      items: [
        "Complete source code of the application",
        "Database structure and documentation",
        "User documentation and training materials",
        "Deployment to production environment",
        "Post-launch support as specified",
      ],
    },
    paymentTerms: {
      title: "Payment Terms",
      content: `The total project cost is ${formatCurrency(dynamicFields.price)}. Payment shall be made according to the following schedule:\n\n• 40% upon project commencement\n• 30% upon design approval\n• 30% upon final delivery and acceptance\n\nAll payments are due within 7 days of invoice date. Late payments may incur a 2% monthly interest charge.`,
    },
    ownership: {
      title: "Intellectual Property & Ownership",
      content:
        "Upon receipt of full payment, all intellectual property rights, including but not limited to source code, designs, documentation, and any other deliverables created under this agreement, shall be transferred to and become the exclusive property of the Client. Until full payment is received, all work product remains the property of the Developer.",
    },
    confidentiality: {
      title: "Confidentiality",
      content:
        "Both parties agree to maintain strict confidentiality regarding all proprietary information, trade secrets, business processes, and technical information disclosed during the course of this engagement. This obligation shall survive the termination of this agreement for a period of two (2) years.",
    },
    warranties: {
      title: "Warranties & Support",
      content:
        "The Developer warrants that:\n\n• All work will be performed in a professional and workmanlike manner\n• The deliverables will substantially conform to the agreed specifications\n• The work will be free from defects for a period of 30 days after delivery\n\nDuring the warranty period, the Developer will fix any bugs or defects at no additional cost.",
    },
    termination: {
      title: "Termination",
      content:
        "Either party may terminate this agreement with 14 days written notice. In case of termination:\n\n• The Client shall pay for all work completed up to the termination date\n• The Developer shall deliver all completed work to the Client\n• No refunds will be issued for completed milestones\n• Unused advance payments will be refunded within 30 days",
    },
    liability: {
      title: "Limitation of Liability",
      content: `The Developer's total liability under this agreement shall not exceed the total amount paid by the Client under this agreement. In no event shall either party be liable for any indirect, incidental, special, consequential, or punitive damages, including but not limited to loss of profits, data, or business opportunities.`,
    },
    disputeResolution: {
      title: "Dispute Resolution",
      content:
        "Any disputes arising out of or relating to this agreement shall first be attempted to be resolved through good faith negotiation between the parties. If negotiation fails, the dispute shall be resolved through binding arbitration in accordance with the Arbitration and Conciliation Act, 1996. The seat of arbitration shall be [City, India].",
    },
    generalProvisions: {
      title: "General Provisions",
      content:
        "• This agreement constitutes the entire understanding between the parties\n• Any modifications must be in writing and signed by both parties\n• This agreement shall be governed by the laws of India\n• If any provision is found unenforceable, other provisions remain in effect\n• Neither party may assign this agreement without written consent",
    },
  };
};

module.exports = {
  getAgreements,
  getAgreement,
  createAgreement,
  updateAgreement,
  deleteAgreement,
  updateAgreementStatus,
  duplicateAgreement,
  getAgreementStats,
};
