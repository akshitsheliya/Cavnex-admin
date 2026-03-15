const Proposal = require("../models/Proposal");
const Client = require("../models/Client");
const Project = require("../models/Project");
const { validationResult } = require("express-validator");

// Get all proposals
const getProposals = async (req, res, next) => {
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
      search,
      sortBy = "createdAt",
      sortOrder = "desc",
    } = req.query;

    const query = { createdBy: req.user._id };

    if (status) query.status = status;
    if (client) query.client = client;

    if (search) {
      query.$or = [
        { title: { $regex: search, $options: "i" } },
        { proposalNumber: { $regex: search, $options: "i" } },
      ];
    }

    const skip = (parseInt(page) - 1) * parseInt(limit);
    const sortOptions = { [sortBy]: sortOrder === "desc" ? -1 : 1 };

    const [proposals, total] = await Promise.all([
      Proposal.find(query)
        .populate("client", "clientName businessName email")
        .populate("project", "projectName")
        .sort(sortOptions)
        .skip(skip)
        .limit(parseInt(limit))
        .lean(),
      Proposal.countDocuments(query),
    ]);

    res.status(200).json({
      success: true,
      data: proposals,
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

// Get single proposal
const getProposal = async (req, res, next) => {
  try {
    const proposal = await Proposal.findOne({
      _id: req.params.id,
      createdBy: req.user._id,
    })
      .populate("client")
      .populate("project");

    if (!proposal) {
      return res.status(404).json({
        success: false,
        message: "Proposal not found",
      });
    }

    res.status(200).json({
      success: true,
      data: proposal,
    });
  } catch (error) {
    next(error);
  }
};

// Create proposal
const createProposal = async (req, res, next) => {
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

    // If project is provided, verify it exists
    if (req.body.project) {
      const projectExists = await Project.findOne({
        _id: req.body.project,
        createdBy: req.user._id,
      });

      if (!projectExists) {
        return res.status(404).json({
          success: false,
          message: "Project not found",
        });
      }
    }

    // ✅ FIX: Handle empty string dates
    if (!req.body.validUntil || req.body.validUntil === "") {
      const validUntil = new Date();
      validUntil.setDate(validUntil.getDate() + 30);
      req.body.validUntil = validUntil;
    }

    // ✅ FIX: Clean timeline empty dates
    if (req.body.timeline) {
      if (req.body.timeline.startDate === "") {
        delete req.body.timeline.startDate;
      }
      if (req.body.timeline.endDate === "") {
        delete req.body.timeline.endDate;
      }
      if (req.body.timeline.totalDuration === "") {
        delete req.body.timeline.totalDuration;
      }
    }

    // Set prepared for from client
    if (!req.body.coverPage?.preparedFor) {
      req.body.coverPage = {
        ...req.body.coverPage,
        preparedFor: clientExists.businessName || clientExists.clientName,
      };
    }

    const proposal = await Proposal.create({
      ...req.body,
      createdBy: req.user._id,
    });

    const populatedProposal = await Proposal.findById(proposal._id)
      .populate("client", "clientName businessName email")
      .populate("project", "projectName");

    res.status(201).json({
      success: true,
      message: "Proposal created successfully",
      data: populatedProposal,
    });
  } catch (error) {
    next(error);
  }
};

// Update proposal
const updateProposal = async (req, res, next) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({
        success: false,
        message: "Validation failed",
        errors: errors.array(),
      });
    }

    const proposal = await Proposal.findOne({
      _id: req.params.id,
      createdBy: req.user._id,
    });

    if (!proposal) {
      return res.status(404).json({
        success: false,
        message: "Proposal not found",
      });
    }

    // Don't allow updates to accepted/rejected proposals
    if (
      ["accepted", "rejected"].includes(proposal.status) &&
      req.body.status !== proposal.status
    ) {
      // Allow status change for accepted/rejected
    } else if (["accepted", "rejected"].includes(proposal.status)) {
      return res.status(400).json({
        success: false,
        message: "Cannot modify accepted or rejected proposals",
      });
    }

    const updatedProposal = await Proposal.findByIdAndUpdate(
      req.params.id,
      { ...req.body, updatedAt: new Date() },
      { new: true, runValidators: true }
    )
      .populate("client", "clientName businessName email")
      .populate("project", "projectName");

    res.status(200).json({
      success: true,
      message: "Proposal updated successfully",
      data: updatedProposal,
    });
  } catch (error) {
    next(error);
  }
};

// Delete proposal
const deleteProposal = async (req, res, next) => {
  try {
    const proposal = await Proposal.findOne({
      _id: req.params.id,
      createdBy: req.user._id,
    });

    if (!proposal) {
      return res.status(404).json({
        success: false,
        message: "Proposal not found",
      });
    }

    await Proposal.findByIdAndDelete(req.params.id);

    res.status(200).json({
      success: true,
      message: "Proposal deleted successfully",
    });
  } catch (error) {
    next(error);
  }
};

// Update proposal status
const updateProposalStatus = async (req, res, next) => {
  try {
    const { status, rejectionReason } = req.body;

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
      "accepted",
      "rejected",
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
      case "accepted":
        updateData.acceptedAt = new Date();
        break;
      case "rejected":
        updateData.rejectedAt = new Date();
        if (rejectionReason) {
          updateData.rejectionReason = rejectionReason;
        }
        break;
    }

    const proposal = await Proposal.findOneAndUpdate(
      { _id: req.params.id, createdBy: req.user._id },
      updateData,
      { new: true }
    ).populate("client", "clientName businessName email");

    if (!proposal) {
      return res.status(404).json({
        success: false,
        message: "Proposal not found",
      });
    }

    res.status(200).json({
      success: true,
      message: "Proposal status updated successfully",
      data: proposal,
    });
  } catch (error) {
    next(error);
  }
};

// Duplicate proposal
const duplicateProposal = async (req, res, next) => {
  try {
    const proposal = await Proposal.findOne({
      _id: req.params.id,
      createdBy: req.user._id,
    });

    if (!proposal) {
      return res.status(404).json({
        success: false,
        message: "Proposal not found",
      });
    }

    const proposalData = proposal.toObject();
    delete proposalData._id;
    delete proposalData.proposalNumber;
    delete proposalData.createdAt;
    delete proposalData.updatedAt;
    delete proposalData.sentAt;
    delete proposalData.viewedAt;
    delete proposalData.acceptedAt;
    delete proposalData.rejectedAt;

    proposalData.title = `${proposalData.title} (Copy)`;
    proposalData.status = "draft";

    const validUntil = new Date();
    validUntil.setDate(validUntil.getDate() + 30);
    proposalData.validUntil = validUntil;

    const newProposal = await Proposal.create(proposalData);

    const populatedProposal = await Proposal.findById(newProposal._id).populate(
      "client",
      "clientName businessName email"
    );

    res.status(201).json({
      success: true,
      message: "Proposal duplicated successfully",
      data: populatedProposal,
    });
  } catch (error) {
    next(error);
  }
};

// Get proposal stats
const getProposalStats = async (req, res, next) => {
  try {
    const userId = req.user._id;

    const [totalProposals, statusCounts, recentProposals, totalValue] =
      await Promise.all([
        Proposal.countDocuments({ createdBy: userId }),
        Proposal.aggregate([
          { $match: { createdBy: userId } },
          { $group: { _id: "$status", count: { $sum: 1 } } },
        ]),
        Proposal.find({ createdBy: userId })
          .populate("client", "businessName")
          .sort({ createdAt: -1 })
          .limit(5)
          .lean(),
        Proposal.aggregate([
          { $match: { createdBy: userId, status: "accepted" } },
          { $group: { _id: null, total: { $sum: "$pricing.total" } } },
        ]),
      ]);

    res.status(200).json({
      success: true,
      data: {
        totalProposals,
        statusCounts: statusCounts.reduce((acc, item) => {
          acc[item._id] = item.count;
          return acc;
        }, {}),
        recentProposals,
        totalAcceptedValue: totalValue[0]?.total || 0,
      },
    });
  } catch (error) {
    next(error);
  }
};

// Create proposal from calculator
const createFromCalculator = async (req, res, next) => {
  try {
    const {
      clientId,
      projectName,
      projectType,
      features,
      customAddOns,
      timeline,
      support,
      discount,
      calculation,
    } = req.body;

    // Verify client exists
    const client = await Client.findOne({
      _id: clientId,
      createdBy: req.user._id,
    });

    if (!client) {
      return res.status(404).json({
        success: false,
        message: "Client not found",
      });
    }

    // Build proposal data
    const proposalData = {
      title: `Proposal for ${projectName || client.businessName || client.clientName}`,
      client: clientId,
      projectType,
      coverPage: {
        companyName: "Your Agency Name",
        preparedFor: client.businessName || client.clientName,
        date: new Date(),
      },
      overview: {
        introduction: `We are pleased to present this proposal for your ${projectType} project.`,
        objectives: [
          "Deliver a high-quality solution",
          "Meet all specified requirements",
          "Ensure timely delivery",
        ],
        solution: `Our team will develop a custom ${projectType} solution tailored to your needs.`,
      },
      scope: {
        included: features.map((f) => f.label),
        excluded: [
          "Third-party integrations not listed",
          "Content creation",
          "Ongoing maintenance (unless selected)",
        ],
        assumptions: [
          "Client will provide all necessary content",
          "Timely feedback from client",
          "Access to required accounts/services",
        ],
      },
      features: features.map((f) => ({
        name: f.label,
        description: f.description || "",
        price: f.price,
        included: true,
      })),
      timeline: {
        totalDuration: timeline.label,
        milestones: [
          {
            title: "Discovery & Planning",
            duration: "1 week",
            deliverables: ["Requirements document", "Project plan"],
          },
          {
            title: "Design",
            duration: "2 weeks",
            deliverables: ["Wireframes", "UI/UX designs"],
          },
          {
            title: "Development",
            duration: "4 weeks",
            deliverables: ["Functional application", "Testing"],
          },
          {
            title: "Launch",
            duration: "1 week",
            deliverables: ["Deployment", "Training"],
          },
        ],
      },
      pricing: {
        basePrice: calculation.basePrice,
        featuresPrice: calculation.featuresPrice,
        customAddOns: customAddOns,
        discount: discount,
        discountType: "percentage",
        tax: 18,
      },
      paymentTerms: {
        terms: [
          {
            milestone: "Project Start",
            percentage: 40,
            amount: calculation.grandTotal * 0.4,
          },
          {
            milestone: "Design Approval",
            percentage: 30,
            amount: calculation.grandTotal * 0.3,
          },
          {
            milestone: "Project Completion",
            percentage: 30,
            amount: calculation.grandTotal * 0.3,
          },
        ],
        paymentMethods: ["Bank Transfer", "UPI", "Cheque"],
        notes: "All payments are due within 7 days of invoice date.",
      },
      termsAndConditions: [
        {
          title: "Intellectual Property",
          content:
            "All work created becomes property of the client upon full payment.",
        },
        {
          title: "Revisions",
          content:
            "Two rounds of revisions are included. Additional revisions will be billed separately.",
        },
        {
          title: "Confidentiality",
          content:
            "Both parties agree to maintain confidentiality of all shared information.",
        },
      ],
      status: "draft",
      createdBy: req.user._id,
    };

    const proposal = await Proposal.create(proposalData);

    const populatedProposal = await Proposal.findById(proposal._id).populate(
      "client",
      "clientName businessName email"
    );

    res.status(201).json({
      success: true,
      message: "Proposal created from calculator",
      data: populatedProposal,
    });
  } catch (error) {
    next(error);
  }
};

module.exports = {
  getProposals,
  getProposal,
  createProposal,
  updateProposal,
  deleteProposal,
  updateProposalStatus,
  duplicateProposal,
  getProposalStats,
  createFromCalculator,
};
