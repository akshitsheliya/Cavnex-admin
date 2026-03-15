const express = require("express");
const router = express.Router();
const {
  register,
  login,
  getProfile,
  updateProfile,
  changePassword,
  logout,
  verifyToken,
} = require("../controllers/authController");
const { protect } = require("../middleware/authMiddleware");
const {
  registerValidator,
  loginValidator,
  updateProfileValidator,
  changePasswordValidator,
} = require("../validators/authValidator");

router.post("/register", registerValidator, register);

router.post("/login", loginValidator, login);

router.get("/profile", protect, getProfile);

router.put("/profile", protect, updateProfileValidator, updateProfile);

router.put(
  "/change-password",
  protect,
  changePasswordValidator,
  changePassword
);

router.post("/logout", protect, logout);

router.get("/verify", protect, verifyToken);

module.exports = router;
