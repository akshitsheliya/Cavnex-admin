const Organization = require("../models/Organization");

const attachOrganization = async (req, res, next) => {
  try {
    if (!req.user) {
      return res.status(401).json({
        success: false,
        message: "Not authorized",
      });
    }

    let organizationId = null;

    if (req.user.organization) {
      if (
        typeof req.user.organization === "object" &&
        req.user.organization._id
      ) {
        organizationId = req.user.organization._id;
      } else if (typeof req.user.organization === "string") {
        organizationId = req.user.organization;
      } else {
        organizationId = req.user.organization;
      }
    }

    if (!organizationId) {
      req.organizationId = null;
      return next();
    }

    req.organizationId = organizationId.toString();
    next();
  } catch (error) {
    console.error("❌ [ORG] Error:", error);
    console.error("❌ [ORG] Stack:", error.stack);
    req.organizationId = null;
    next();
  }
};

const requireOrganization = async (req, res, next) => {
  try {
    if (!req.user) {
      return res.status(401).json({
        success: false,
        message: "Not authorized",
      });
    }

    if (!req.organizationId) {
      return res.status(400).json({
        success: false,
        message: "Organization is required. Please contact support.",
      });
    }

    next();
  } catch (error) {
    console.error("❌ [REQUIRE ORG] Error:", error);
    next(error);
  }
};

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

      if (!memberRole) {
        return res.status(403).json({
          success: false,
          message: "You are not a member of this organization",
        });
      }

      if (!allowedRoles.includes(memberRole)) {
        return res.status(403).json({
          success: false,
          message: `Requires: ${allowedRoles.join(", ")}. Your role: ${memberRole}`,
        });
      }

      req.organization = organization;
      req.orgRole = memberRole;

      next();
    } catch (error) {
      console.error("❌ [ROLE] Error:", error);
      next(error);
    }
  };
};

const verifyOrgAccess = async (req, res, next) => {
  try {
    const { organizationId } = req.params;
    const userOrgId = req.organizationId;

    if (!userOrgId) {
      return res.status(400).json({
        success: false,
        message: "No organization associated with your account",
      });
    }

    if (organizationId !== userOrgId) {
      return res.status(403).json({
        success: false,
        message: "You don't have access to this organization",
      });
    }

    next();
  } catch (error) {
    console.error("❌ [ACCESS] Error:", error);
    next(error);
  }
};

const optionalOrganization = async (req, res, next) => {
  try {
    if (!req.user) {
      req.organizationId = null;
      return next();
    }

    const organizationId = req.user.organization?._id || req.user.organization;
    req.organizationId = organizationId ? organizationId.toString() : null;

    next();
  } catch (error) {
    console.error("❌ [OPTIONAL ORG] Error:", error);
    req.organizationId = null;
    next();
  }
};

module.exports = {
  attachOrganization,
  requireOrganization,
  requireOrgRole,
  verifyOrgAccess,
  optionalOrganization,
};
