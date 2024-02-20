/** @format */

const express = require("express");

const validateRequest = require("../../middleware/validateRequestJoi.middleware");
const verifyTokenUser = require("@/middleware/verifyTokenUser");
const { shippingSchema } = require("@/validation/shipping");
const {
  getShippingCost,
} = require("@/controllers/shipping/shipping.controller");

const router = express.Router();
router.post("/", verifyTokenUser, getShippingCost);

module.exports = router;
