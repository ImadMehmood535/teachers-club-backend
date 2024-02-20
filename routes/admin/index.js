/** @format */

const express = require("express");

const validateRequest = require("../../middleware/validateRequestJoi.middleware");

const { loginSchema, registerSchema } = require("../../validation/admin/index");

const {
  loginAdmin,
  registerAdmin,
  logoutAdmin,
  refreshAdmin,
  forgetPassword,
  resendOtp,
  changePassword,
  resetPassword,
} = require("../../controllers/admin/admin.controller");
const verifyToken = require("@/middleware/verifyToken");

const router = express.Router();

router.post("/register", validateRequest(registerSchema), registerAdmin);
router.post("/login", validateRequest(loginSchema), loginAdmin);
router.post("/logout", verifyToken, logoutAdmin);
router.post("/refresh_token", refreshAdmin);
router.post("/forget", forgetPassword);
router.post("/resendOtp", resendOtp);
router.patch("/changePassword", verifyToken, changePassword);
router.post("/resetPassword", resetPassword);

module.exports = router;
