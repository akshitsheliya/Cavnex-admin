const User = require("../models/User");
const Organization = require("../models/Organization");
const jwt = require("jsonwebtoken");
const { validationResult } = require("express-validator");

const generateToken = (id) => {
  return jwt.sign({ id }, process.env.JWT_SECRET, {
    expiresIn: process.env.JWT_EXPIRE || "7d",
  });
};

const sendTokenResponse = (user, statusCode, res, message) => {
  const token = generateToken(user._id);

  const userResponse = {
    _id: user._id,
    name: user.name,
    email: user.email,
    role: user.role,
    avatar: user.avatar,
    isActive: user.isActive,
    createdAt: user.createdAt,
    organization: user.organization,
  };

  res.status(statusCode).json({
    success: true,
    message,
    token,
    user: userResponse,
  });
};

// ✅ FIXED REGISTER FUNCTION
const register = async (req, res, next) => {
  let createdUser = null;
  
  try {
    // Validation
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      console.log("❌ Validation errors:", errors.array());
      return res.status(400).json({
        success: false,
        message: "Validation failed",
        errors: errors.array().map((err) => ({
          field: err.path,
          message: err.msg,
        })),
      });
    }

    const { name, email, password, role, organizationName } = req.body;

    console.log("📝 Registration attempt:", { name, email });

    // Check existing user
    const existingUser = await User.findOne({ 
      email: email.toLowerCase() 
    });
    
    if (existingUser) {
      console.log("⚠️ User already exists:", email);
      return res.status(400).json({
        success: false,
        message: "User with this email already exists",
      });
    }

    console.log("✅ Email available, creating user...");

    // ✅ Step 1: Create user WITHOUT organization
    createdUser = await User.create({
      name: name.trim(),
      email: email.toLowerCase().trim(),
      password,
      role: role || "admin",
    });

    console.log("✅ User created:", createdUser._id);

    // ✅ Step 2: Create organization
    let organization = null;
    try {
      const orgName = organizationName?.trim() || `${name.trim()}'s Organization`;
      
      console.log("🏢 Creating organization:", orgName);
      
      organization = await Organization.create({
        name: orgName,
        owner: createdUser._id,
        members: [
          {
            user: createdUser._id,
            role: "owner",
            joinedAt: new Date(),
          },
        ],
        settings: {
          companyName: orgName,
          companyEmail: email.toLowerCase().trim(),
        },
      });

      console.log("✅ Organization created:", organization._id);

      // ✅ Step 3: Link organization to user
      createdUser.organization = organization._id;
      await createdUser.save({ validateBeforeSave: false });
      
      console.log("✅ User-Organization linked");

    } catch (orgError) {
      console.error("⚠️ Organization creation failed:", orgError.message);
      console.error("Stack:", orgError.stack);
      // Continue - user is created, organization can be added later
    }

    // ✅ Populate organization for response
    const userWithOrg = await User.findById(createdUser._id)
      .populate("organization", "name slug");

    console.log("✅ Registration successful, sending response");

    // ✅ Send success response
    sendTokenResponse(
      userWithOrg || createdUser, 
      201, 
      res, 
      "Registration successful"
    );

  } catch (error) {
    console.error("❌ Registration Error:", error.message);
    console.error("Stack:", error.stack);
    
    // ✅ Cleanup: If user was created but something failed, optionally delete
    // (Comment this out if you want to keep partial registrations)
    /*
    if (createdUser) {
      try {
        await User.findByIdAndDelete(createdUser._id);
        console.log("🧹 Cleaned up partially created user");
      } catch (cleanupError) {
        console.error("⚠️ Cleanup failed:", cleanupError.message);
      }
    }
    */

    // ✅ Always send proper error response
    return res.status(500).json({
      success: false,
      message: error.message || "Registration failed. Please try again.",
      ...(process.env.NODE_ENV === "development" && { 
        stack: error.stack 
      }),
    });
  }
};

// ✅ FIXED LOGIN FUNCTION
const login = async (req, res, next) => {
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

    const { email, password } = req.body;

    console.log("🔐 Login attempt:", email);

    // Find user with password
    const user = await User.findOne({ 
      email: email.toLowerCase() 
    })
      .select("+password")
      .populate("organization", "name slug");

    if (!user) {
      console.log("⚠️ User not found:", email);
      return res.status(401).json({
        success: false,
        message: "Invalid email or password",
      });
    }

    if (!user.isActive) {
      console.log("⚠️ Inactive account:", email);
      return res.status(401).json({
        success: false,
        message: "Your account has been deactivated. Please contact support.",
      });
    }

    // Verify password
    const isPasswordValid = await user.comparePassword(password);

    if (!isPasswordValid) {
      console.log("⚠️ Invalid password for:", email);
      return res.status(401).json({
        success: false,
        message: "Invalid email or password",
      });
    }

    // Update last login
    user.lastLogin = new Date();
    await user.save({ validateBeforeSave: false });

    console.log("✅ Login successful:", email);

    sendTokenResponse(user, 200, res, "Login successful");
    
  } catch (error) {
    console.error("❌ Login Error:", error.message);
    return res.status(500).json({
      success: false,
      message: "Login failed. Please try again.",
    });
  }
};

const getProfile = async (req, res, next) => {
  try {
    const user = await User.findById(req.user._id).populate(
      "organization",
      "name slug settings"
    );

    if (!user) {
      return res.status(404).json({
        success: false,
        message: "User not found",
      });
    }

    res.status(200).json({
      success: true,
      user,
    });
  } catch (error) {
    next(error);
  }
};

const updateProfile = async (req, res, next) => {
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

    const { name, email, avatar } = req.body;

    if (email && email !== req.user.email) {
      const existingUser = await User.findOne({ 
        email: email.toLowerCase() 
      });
      if (existingUser) {
        return res.status(400).json({
          success: false,
          message: "Email is already in use",
        });
      }
    }

    const updateData = {};
    if (name) updateData.name = name.trim();
    if (email) updateData.email = email.toLowerCase().trim();
    if (avatar !== undefined) updateData.avatar = avatar;

    const user = await User.findByIdAndUpdate(req.user._id, updateData, {
      new: true,
      runValidators: true,
    }).populate("organization", "name slug");

    res.status(200).json({
      success: true,
      message: "Profile updated successfully",
      user,
    });
  } catch (error) {
    next(error);
  }
};

const changePassword = async (req, res, next) => {
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

    const { currentPassword, newPassword } = req.body;

    const user = await User.findById(req.user._id).select("+password");

    if (!user) {
      return res.status(404).json({
        success: false,
        message: "User not found",
      });
    }

    const isPasswordValid = await user.comparePassword(currentPassword);

    if (!isPasswordValid) {
      return res.status(401).json({
        success: false,
        message: "Current password is incorrect",
      });
    }

    user.password = newPassword;
    await user.save();

    sendTokenResponse(user, 200, res, "Password changed successfully");
  } catch (error) {
    next(error);
  }
};

const logout = async (req, res, next) => {
  try {
    res.status(200).json({
      success: true,
      message: "Logged out successfully",
    });
  } catch (error) {
    next(error);
  }
};

const verifyToken = async (req, res, next) => {
  try {
    const user = await User.findById(req.user._id).populate(
      "organization",
      "name slug"
    );

    if (!user) {
      return res.status(404).json({
        success: false,
        message: "User not found",
      });
    }

    res.status(200).json({
      success: true,
      message: "Token is valid",
      user,
    });
  } catch (error) {
    next(error);
  }
};

module.exports = {
  register,
  login,
  getProfile,
  updateProfile,
  changePassword,
  logout,
  verifyToken,
};