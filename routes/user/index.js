/** @format */

const express = require("express");

const validateRequest = require("../../middleware/validateRequestJoi.middleware");

const verifyToken = require("@/middleware/verifyToken");
const {
  registerSchema,
  loginSchema,
  getAllSchema,
  getByIdSchema,
  editUserSchema,
} = require("@/validation/user");
const {
  registerUser,
  loginUser,
  logoutUser,
  refreshUser,
  verifyOtp,
  resendOtp,
  forgetPassword,
  changePassword,
  resetPassword,
  getAllUsers,
  getUserById,
  editUser,
} = require("@/controllers/user/user.controller");
const verifyTokenUser = require("@/middleware/verifyTokenUser");
const verifyTokenAll = require("@/middleware/verifyTokenAll");

const router = express.Router();

router.post("/register", validateRequest(registerSchema), registerUser);
router.post("/login", validateRequest(loginSchema), loginUser);
router.post("/logout", verifyTokenUser, logoutUser);
router.post("/refresh_token", verifyTokenUser, refreshUser);
router.post("/verify_otp", verifyOtp);
router.post("/resend_otp", resendOtp);
router.post("/forget_password", forgetPassword);
router.post("/reset_password", resetPassword);
router.post("/change_password", verifyTokenUser, changePassword);
router.get("/", verifyTokenAll, validateRequest(getAllSchema), getAllUsers);
router.get(
  "/:userId",
  verifyTokenAll,
  validateRequest(getByIdSchema),
  getUserById
);
router.patch("/:userId", validateRequest(editUserSchema), editUser);
module.exports = router;
