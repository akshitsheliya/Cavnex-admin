const Project = require("../models/Project");
const Client = require("../models/Client");
const { validationResult } = require("express-validator");
const {
  buildOrgQuery,
  buildOrgQueryWithFilters,
  getAggregateMatch,
  withOrgData,
} = require("../utils/orgHelper");

const getProjects = async (req, res, next) => {
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
      projectType,
      client,
      priority,
      search,
      sortBy = "createdAt",
      sortOrder = "desc",
    } = req.query;

    // ✅ UPDATED: Use organization-based query
    const query = buildOrgQuery(req);

    if (status) query.status = status;
    if (projectType) query.projectType = projectType;
    if (client) query.client = client;
    if (priority) query.priority = priority;

    if (search) {
      query.$or = [
        { projectName: { $regex: search, $options: "i" } },
        { description: { $regex: search, $options: "i" } },
      ];
    }

    const skip = (parseInt(page) - 1) * parseInt(limit);
    const sortOptions = { [sortBy]: sortOrder === "desc" ? -1 : 1 };

    const [projects, total] = await Promise.all([
      Project.find(query)
        .populate("client", "clientName businessName email")
        .sort(sortOptions)
        .skip(skip)
        .limit(parseInt(limit))
        .lean(),
      Project.countDocuments(query),
    ]);

    res.status(200).json({
      success: true,
      data: projects,
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

const getProject = async (req, res, next) => {
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
    const query = buildOrgQueryWithFilters(req, { _id: req.params.id });

    const project = await Project.findOne(query)
      .populate("client", "clientName businessName email phone")
      .populate("team.user", "name email");

    if (!project) {
      return res.status(404).json({
        success: false,
        message: "Project not found",
      });
    }

    res.status(200).json({
      success: true,
      data: project,
    });
  } catch (error) {
    next(error);
  }
};

const createProject = async (req, res, next) => {
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

    // ✅ UPDATED: Check client within organization
    const clientQuery = buildOrgQueryWithFilters(req, { _id: req.body.client });
    const clientExists = await Client.findOne(clientQuery);

    if (!clientExists) {
      return res.status(404).json({
        success: false,
        message: "Client not found",
      });
    }

    // ✅ UPDATED: Add organization to project
    const project = await Project.create(withOrgData(req, req.body));

    await Client.findByIdAndUpdate(req.body.client, {
      $inc: { totalProjects: 1 },
    });

    const populatedProject = await Project.findById(project._id).populate(
      "client",
      "clientName businessName email"
    );

    res.status(201).json({
      success: true,
      message: "Project created successfully",
      data: populatedProject,
    });
  } catch (error) {
    next(error);
  }
};

const updateProject = async (req, res, next) => {
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
    const query = buildOrgQueryWithFilters(req, { _id: req.params.id });
    const project = await Project.findOne(query);

    if (!project) {
      return res.status(404).json({
        success: false,
        message: "Project not found",
      });
    }

    // ✅ UPDATED: Check client within organization
    if (req.body.client && req.body.client !== project.client.toString()) {
      const clientQuery = buildOrgQueryWithFilters(req, {
        _id: req.body.client,
      });
      const clientExists = await Client.findOne(clientQuery);
      if (!clientExists) {
        return res.status(404).json({
          success: false,
          message: "Client not found",
        });
      }
    }

    const updatedProject = await Project.findByIdAndUpdate(
      req.params.id,
      { ...req.body, updatedAt: new Date() },
      { new: true, runValidators: true }
    ).populate("client", "clientName businessName email");

    res.status(200).json({
      success: true,
      message: "Project updated successfully",
      data: updatedProject,
    });
  } catch (error) {
    next(error);
  }
};

const deleteProject = async (req, res, next) => {
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
    const query = buildOrgQueryWithFilters(req, { _id: req.params.id });
    const project = await Project.findOne(query);

    if (!project) {
      return res.status(404).json({
        success: false,
        message: "Project not found",
      });
    }

    await Client.findByIdAndUpdate(project.client, {
      $inc: { totalProjects: -1 },
    });

    await Project.findByIdAndDelete(req.params.id);

    res.status(200).json({
      success: true,
      message: "Project deleted successfully",
    });
  } catch (error) {
    next(error);
  }
};

const updateProjectStatus = async (req, res, next) => {
  try {
    const { status } = req.body;

    if (!status) {
      return res.status(400).json({
        success: false,
        message: "Status is required",
      });
    }

    const validStatuses = [
      "planning",
      "design",
      "development",
      "testing",
      "review",
      "completed",
      "on_hold",
      "cancelled",
    ];
    if (!validStatuses.includes(status)) {
      return res.status(400).json({
        success: false,
        message: "Invalid status",
      });
    }

    const updateData = { status, updatedAt: new Date() };

    if (status === "completed") {
      updateData.completedDate = new Date();
      updateData.progress = 100;
    }

    // ✅ UPDATED: Use organization-based query
    const query = buildOrgQueryWithFilters(req, { _id: req.params.id });

    const project = await Project.findOneAndUpdate(query, updateData, {
      new: true,
    }).populate("client", "clientName businessName");

    if (!project) {
      return res.status(404).json({
        success: false,
        message: "Project not found",
      });
    }

    res.status(200).json({
      success: true,
      message: "Project status updated successfully",
      data: project,
    });
  } catch (error) {
    next(error);
  }
};

const updateProjectProgress = async (req, res, next) => {
  try {
    const { progress } = req.body;

    if (progress === undefined || progress < 0 || progress > 100) {
      return res.status(400).json({
        success: false,
        message: "Progress must be between 0 and 100",
      });
    }

    const updateData = { progress, updatedAt: new Date() };

    if (progress === 100) {
      updateData.status = "completed";
      updateData.completedDate = new Date();
    }

    // ✅ UPDATED: Use organization-based query
    const query = buildOrgQueryWithFilters(req, { _id: req.params.id });

    const project = await Project.findOneAndUpdate(query, updateData, {
      new: true,
    });

    if (!project) {
      return res.status(404).json({
        success: false,
        message: "Project not found",
      });
    }

    res.status(200).json({
      success: true,
      message: "Project progress updated successfully",
      data: project,
    });
  } catch (error) {
    next(error);
  }
};

const addFeature = async (req, res, next) => {
  try {
    const { name, description, estimatedHours } = req.body;

    if (!name) {
      return res.status(400).json({
        success: false,
        message: "Feature name is required",
      });
    }

    // ✅ UPDATED: Use organization-based query
    const query = buildOrgQueryWithFilters(req, { _id: req.params.id });

    const project = await Project.findOneAndUpdate(
      query,
      {
        $push: {
          features: { name, description, estimatedHours, status: "pending" },
        },
        updatedAt: new Date(),
      },
      { new: true }
    );

    if (!project) {
      return res.status(404).json({
        success: false,
        message: "Project not found",
      });
    }

    res.status(200).json({
      success: true,
      message: "Feature added successfully",
      data: project,
    });
  } catch (error) {
    next(error);
  }
};

const updateFeature = async (req, res, next) => {
  try {
    const { featureId } = req.params;
    const { name, description, status, estimatedHours, actualHours } = req.body;

    // ✅ UPDATED: Use organization-based query
    const query = buildOrgQueryWithFilters(req, { _id: req.params.id });
    const project = await Project.findOne(query);

    if (!project) {
      return res.status(404).json({
        success: false,
        message: "Project not found",
      });
    }

    const feature = project.features.id(featureId);
    if (!feature) {
      return res.status(404).json({
        success: false,
        message: "Feature not found",
      });
    }

    if (name) feature.name = name;
    if (description !== undefined) feature.description = description;
    if (status) feature.status = status;
    if (estimatedHours !== undefined) feature.estimatedHours = estimatedHours;
    if (actualHours !== undefined) feature.actualHours = actualHours;

    project.progress = project.calculateProgress();
    await project.save();

    res.status(200).json({
      success: true,
      message: "Feature updated successfully",
      data: project,
    });
  } catch (error) {
    next(error);
  }
};

const deleteFeature = async (req, res, next) => {
  try {
    const { featureId } = req.params;

    // ✅ UPDATED: Use organization-based query
    const query = buildOrgQueryWithFilters(req, { _id: req.params.id });

    const project = await Project.findOneAndUpdate(
      query,
      {
        $pull: { features: { _id: featureId } },
        updatedAt: new Date(),
      },
      { new: true }
    );

    if (!project) {
      return res.status(404).json({
        success: false,
        message: "Project not found",
      });
    }

    project.progress = project.calculateProgress();
    await project.save();

    res.status(200).json({
      success: true,
      message: "Feature deleted successfully",
      data: project,
    });
  } catch (error) {
    next(error);
  }
};

const addMilestone = async (req, res, next) => {
  try {
    const { title, description, dueDate } = req.body;

    if (!title) {
      return res.status(400).json({
        success: false,
        message: "Milestone title is required",
      });
    }

    // ✅ UPDATED: Use organization-based query
    const query = buildOrgQueryWithFilters(req, { _id: req.params.id });

    const project = await Project.findOneAndUpdate(
      query,
      {
        $push: {
          milestones: { title, description, dueDate, status: "pending" },
        },
        updatedAt: new Date(),
      },
      { new: true }
    );

    if (!project) {
      return res.status(404).json({
        success: false,
        message: "Project not found",
      });
    }

    res.status(200).json({
      success: true,
      message: "Milestone added successfully",
      data: project,
    });
  } catch (error) {
    next(error);
  }
};

const getProjectStats = async (req, res, next) => {
  try {
    // ✅ UPDATED: Use organization-based stats
    const orgId = req.organizationId;
    const userId = req.user._id;
    const matchQuery = getAggregateMatch(req);

    const [
      statusCounts,
      typeCounts,
      revenueStats,
      totalProjects,
      recentProjects,
    ] = await Promise.all([
      Project.getStatusCounts(orgId, userId),
      Project.getTypeCounts(orgId, userId),
      Project.getRevenueStats(orgId, userId),
      Project.countDocuments(buildOrgQuery(req)),
      Project.find(buildOrgQuery(req))
        .populate("client", "businessName")
        .sort({ createdAt: -1 })
        .limit(5)
        .lean(),
    ]);

    const activeProjects = await Project.countDocuments({
      ...buildOrgQuery(req),
      status: { $nin: ["completed", "cancelled"] },
    });

    const overdueProjects = await Project.countDocuments({
      ...buildOrgQuery(req),
      deadline: { $lt: new Date() },
      status: { $nin: ["completed", "cancelled"] },
    });

    res.status(200).json({
      success: true,
      data: {
        totalProjects,
        activeProjects,
        overdueProjects,
        statusCounts: statusCounts.reduce((acc, item) => {
          acc[item._id] = item.count;
          return acc;
        }, {}),
        typeCounts: typeCounts.reduce((acc, item) => {
          acc[item._id] = item.count;
          return acc;
        }, {}),
        totalBudget: revenueStats[0]?.totalBudget || 0,
        totalPaid: revenueStats[0]?.totalPaid || 0,
        recentProjects,
      },
    });
  } catch (error) {
    next(error);
  }
};

module.exports = {
  getProjects,
  getProject,
  createProject,
  updateProject,
  deleteProject,
  updateProjectStatus,
  updateProjectProgress,
  addFeature,
  updateFeature,
  deleteFeature,
  addMilestone,
  getProjectStats,
};
