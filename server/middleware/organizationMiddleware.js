const Organization = require("../models/Organization");

const attachOrganization = async (req, res, next) => {
  console.log("\n🏢 === ORGANIZATION MIDDLEWARE START ===");
  console.log("🏢 URL:", req.url);
  console.log("🏢 Method:", req.method);

  try {
    console.log("🏢 Checking req.user...");
    console.log("🏢 req.user exists:", !!req.user);
    console.log("🏢 req.user._id:", req.user?._id);
    console.log("🏢 req.user.email:", req.user?.email);
    console.log("🏢 req.user.organization (raw):", req.user?.organization);
    console.log(
      "🏢 typeof req.user.organization:",
      typeof req.user?.organization
    );

    if (!req.user) {
      console.log("❌ [ORG] No user in request");
      return res.status(401).json({
        success: false,
        message: "Not authorized",
      });
    }

    // Get organization ID from user
    let organizationId = null;

    if (req.user.organization) {
      // Handle both populated and unpopulated cases
      if (
        typeof req.user.organization === "object" &&
        req.user.organization._id
      ) {
        // Populated
        organizationId = req.user.organization._id;
        console.log("🏢 Organization is POPULATED");
      } else if (typeof req.user.organization === "string") {
        // String ID
        organizationId = req.user.organization;
        console.log("🏢 Organization is STRING");
      } else {
        // ObjectId
        organizationId = req.user.organization;
        console.log("🏢 Organization is OBJECTID");
      }
    }

    console.log("🏢 Extracted org ID:", organizationId);
    console.log("🏢 typeof org ID:", typeof organizationId);

    if (!organizationId) {
      console.log("⚠️ [ORG] No organization for user - continuing without org");
      req.organizationId = null;
      return next();
    }

    // Convert to string for consistent comparison
    req.organizationId = organizationId.toString();
    console.log("✅ [ORG] Attached org ID:", req.organizationId);
    console.log("✅ [ORG] Middleware complete, calling next()");

    next();
  } catch (error) {
    console.error("❌ [ORG] Error:", error);
    console.error("❌ [ORG] Stack:", error.stack);
    req.organizationId = null;
    next();
  }
};

const requireOrganization = async (req, res, next) => {
  console.log("\n🔒 === REQUIRE ORGANIZATION START ===");

  try {
    if (!req.user) {
      console.log("❌ [REQUIRE ORG] No user");
      return res.status(401).json({
        success: false,
        message: "Not authorized",
      });
    }

    console.log("🔒 Checking organizationId...");
    console.log("🔒 req.organizationId:", req.organizationId);

    if (!req.organizationId) {
      console.log("❌ [REQUIRE ORG] No organization");
      return res.status(400).json({
        success: false,
        message: "Organization is required. Please contact support.",
      });
    }

    console.log("✅ [REQUIRE ORG] Organization verified:", req.organizationId);
    next();
  } catch (error) {
    console.error("❌ [REQUIRE ORG] Error:", error);
    next(error);
  }
};

const requireOrgRole = (...allowedRoles) => {
  return async (req, res, next) => {
    console.log("\n👤 === REQUIRE ROLE START ===");
    console.log("👤 Required roles:", allowedRoles);

    try {
      if (!req.organizationId) {
        console.log("❌ [ROLE] No organization");
        return res.status(400).json({
          success: false,
          message: "Organization is required",
        });
      }

      const organization = await Organization.findById(req.organizationId);

      if (!organization) {
        console.log("❌ [ROLE] Organization not found");
        return res.status(404).json({
          success: false,
          message: "Organization not found",
        });
      }

      const memberRole = organization.getMemberRole(req.user._id);
      console.log("👤 User role:", memberRole);

      if (!memberRole) {
        console.log("❌ [ROLE] Not a member");
        return res.status(403).json({
          success: false,
          message: "You are not a member of this organization",
        });
      }

      if (!allowedRoles.includes(memberRole)) {
        console.log("❌ [ROLE] Insufficient permissions");
        return res.status(403).json({
          success: false,
          message: `Requires: ${allowedRoles.join(", ")}. Your role: ${memberRole}`,
        });
      }

      req.organization = organization;
      req.orgRole = memberRole;
      console.log("✅ [ROLE] Access granted");

      next();
    } catch (error) {
      console.error("❌ [ROLE] Error:", error);
      next(error);
    }
  };
};

const verifyOrgAccess = async (req, res, next) => {
  console.log("\n🔐 === VERIFY ORG ACCESS START ===");

  try {
    const { organizationId } = req.params;
    const userOrgId = req.organizationId;

    console.log("🔐 Requested org:", organizationId);
    console.log("🔐 User org:", userOrgId);

    if (!userOrgId) {
      return res.status(400).json({
        success: false,
        message: "No organization associated with your account",
      });
    }

    if (organizationId !== userOrgId) {
      console.log("❌ [ACCESS] Denied");
      return res.status(403).json({
        success: false,
        message: "You don't have access to this organization",
      });
    }

    console.log("✅ [ACCESS] Granted");
    next();
  } catch (error) {
    console.error("❌ [ACCESS] Error:", error);
    next(error);
  }
};

const optionalOrganization = async (req, res, next) => {
  console.log("\n📎 === OPTIONAL ORGANIZATION START ===");

  try {
    if (!req.user) {
      req.organizationId = null;
      console.log("📎 No user, skipping");
      return next();
    }

    const organizationId = req.user.organization?._id || req.user.organization;
    req.organizationId = organizationId ? organizationId.toString() : null;

    console.log("📎 Org ID:", req.organizationId || "none");
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
