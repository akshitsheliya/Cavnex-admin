const Organization = require("../models/Organization");
const User = require("../models/User");
const { validationResult } = require("express-validator");

// Get current organization
const getOrganization = async (req, res, next) => {
  try {
    const organization = await Organization.findById(req.organizationId)
      .populate("owner", "name email")
      .populate("members.user", "name email avatar role");

    if (!organization) {
      return res.status(404).json({
        success: false,
        message: "Organization not found",
      });
    }

    res.status(200).json({
      success: true,
      data: organization,
    });
  } catch (error) {
    next(error);
  }
};

// Update organization
const updateOrganization = async (req, res, next) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({
        success: false,
        message: "Validation failed",
        errors: errors.array(),
      });
    }

    const organization = await Organization.findById(req.organizationId);

    if (!organization) {
      return res.status(404).json({
        success: false,
        message: "Organization not found",
      });
    }

    // Check if user is owner or admin
    const memberRole = organization.getMemberRole(req.user._id);
    if (!["owner", "admin"].includes(memberRole)) {
      return res.status(403).json({
        success: false,
        message: "You do not have permission to update organization",
      });
    }

    const { name, settings } = req.body;

    if (name) organization.name = name;
    if (settings) {
      organization.settings = { ...organization.settings, ...settings };
    }

    await organization.save();

    res.status(200).json({
      success: true,
      message: "Organization updated successfully",
      data: organization,
    });
  } catch (error) {
    next(error);
  }
};

// Add member to organization
const addMember = async (req, res, next) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({
        success: false,
        message: "Validation failed",
        errors: errors.array(),
      });
    }

    const { email, role = "member" } = req.body;

    const organization = await Organization.findById(req.organizationId);

    if (!organization) {
      return res.status(404).json({
        success: false,
        message: "Organization not found",
      });
    }

    // Check if user is owner or admin
    const memberRole = organization.getMemberRole(req.user._id);
    if (!["owner", "admin"].includes(memberRole)) {
      return res.status(403).json({
        success: false,
        message: "You do not have permission to add members",
      });
    }

    // Find user by email
    const userToAdd = await User.findByEmail(email);

    if (!userToAdd) {
      return res.status(404).json({
        success: false,
        message: "User not found with this email",
      });
    }

    // Check if user is already a member
    if (organization.isMember(userToAdd._id)) {
      return res.status(400).json({
        success: false,
        message: "User is already a member of this organization",
      });
    }

    // Check if user already belongs to another organization
    if (userToAdd.organization) {
      return res.status(400).json({
        success: false,
        message: "User already belongs to another organization",
      });
    }

    // Add member to organization
    await organization.addMember(userToAdd._id, role);

    // Update user's organization
    userToAdd.organization = organization._id;
    await userToAdd.save({ validateBeforeSave: false });

    // Populate and return
    await organization.populate("members.user", "name email avatar role");

    res.status(200).json({
      success: true,
      message: "Member added successfully",
      data: organization,
    });
  } catch (error) {
    next(error);
  }
};

// Remove member from organization
const removeMember = async (req, res, next) => {
  try {
    const { userId } = req.params;

    const organization = await Organization.findById(req.organizationId);

    if (!organization) {
      return res.status(404).json({
        success: false,
        message: "Organization not found",
      });
    }

    // Check if user is owner
    if (!organization.isOwner(req.user._id)) {
      return res.status(403).json({
        success: false,
        message: "Only owner can remove members",
      });
    }

    // Cannot remove owner
    if (organization.isOwner(userId)) {
      return res.status(400).json({
        success: false,
        message: "Cannot remove organization owner",
      });
    }

    // Check if user is a member
    if (!organization.isMember(userId)) {
      return res.status(400).json({
        success: false,
        message: "User is not a member of this organization",
      });
    }

    // Remove member
    await organization.removeMember(userId);

    // Remove organization from user
    await User.findByIdAndUpdate(userId, { $unset: { organization: 1 } });

    res.status(200).json({
      success: true,
      message: "Member removed successfully",
    });
  } catch (error) {
    next(error);
  }
};

// Update member role
const updateMemberRole = async (req, res, next) => {
  try {
    const { userId } = req.params;
    const { role } = req.body;

    if (!role || !["admin", "manager", "member"].includes(role)) {
      return res.status(400).json({
        success: false,
        message: "Invalid role",
      });
    }

    const organization = await Organization.findById(req.organizationId);

    if (!organization) {
      return res.status(404).json({
        success: false,
        message: "Organization not found",
      });
    }

    // Check if user is owner
    if (!organization.isOwner(req.user._id)) {
      return res.status(403).json({
        success: false,
        message: "Only owner can update member roles",
      });
    }

    // Cannot change owner's role
    if (organization.isOwner(userId)) {
      return res.status(400).json({
        success: false,
        message: "Cannot change owner's role",
      });
    }

    // Find and update member role
    const member = organization.members.find(
      (m) => m.user.toString() === userId
    );

    if (!member) {
      return res.status(404).json({
        success: false,
        message: "Member not found",
      });
    }

    member.role = role;
    await organization.save();

    await organization.populate("members.user", "name email avatar role");

    res.status(200).json({
      success: true,
      message: "Member role updated successfully",
      data: organization,
    });
  } catch (error) {
    next(error);
  }
};

// Get organization members
const getMembers = async (req, res, next) => {
  try {
    const organization = await Organization.findById(req.organizationId)
      .select("members owner")
      .populate("owner", "name email avatar role")
      .populate("members.user", "name email avatar role lastLogin");

    if (!organization) {
      return res.status(404).json({
        success: false,
        message: "Organization not found",
      });
    }

    res.status(200).json({
      success: true,
      data: {
        owner: organization.owner,
        members: organization.members,
      },
    });
  } catch (error) {
    next(error);
  }
};

module.exports = {
  getOrganization,
  updateOrganization,
  addMember,
  removeMember,
  updateMemberRole,
  getMembers,
};
