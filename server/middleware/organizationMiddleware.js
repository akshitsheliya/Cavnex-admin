const Organization = require("../models/Organization");

/**
 * Attach organization ID to request
 * Must be used AFTER protect middleware
 */
const attachOrganization = async (req, res, next) => {
  try {
    // Check if user exists and has organization
    if (!req.user) {
      return res.status(401).json({
        success: false,
        message: "Not authorized",
      });
    }

    // Get organization ID from user
    const organizationId = req.user.organization?._id || req.user.organization;

    if (!organizationId) {
      // ✅ BACKWARD COMPATIBILITY: If user has no organization, continue
      // This allows existing users without organization to still work
      req.organizationId = null;
      return next();
    }

    // Attach organization ID to request
    req.organizationId = organizationId;
    next();
  } catch (error) {
    next(error);
  }
};

/**
 * Require organization to be present
 * Use this for routes that MUST have organization
 */
const requireOrganization = async (req, res, next) => {
  try {
    if (!req.user) {
      return res.status(401).json({
        success: false,
        message: "Not authorized",
      });
    }

    const organizationId = req.user.organization?._id || req.user.organization;

    if (!organizationId) {
      return res.status(400).json({
        success: false,
        message: "Organization is required. Please contact support.",
      });
    }

    req.organizationId = organizationId;
    next();
  } catch (error) {
    next(error);
  }
};

/**
 * Check if user has specific role in organization
 */
const requireOrgRole = (...allowedRoles) => {
  return async (req, res, next) => {
    try {
      if (!req.organizationId) {
        return res.status(400).json({
          success: false,
          message: "Organization is required",
        });
      }

      const organization = await Organization.findById(req.organizationId);

      if (!organization) {
        return res.status(404).json({
          success: false,
          message: "Organization not found",
        });
      }

      const memberRole = organization.getMemberRole(req.user._id);

      if (!memberRole || !allowedRoles.includes(memberRole)) {
        return res.status(403).json({
          success: false,
          message: "You do not have permission to perform this action",
        });
      }

      req.organization = organization;
      req.orgRole = memberRole;
      next();
    } catch (error) {
      next(error);
    }
  };
};

module.exports = {
  attachOrganization,
  requireOrganization,
  requireOrgRole,
};
