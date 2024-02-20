/** @format */

const { Router } = require("express");
const router = Router();
const {
  getOrderById,
  getAllOrder,
  getAllOrderByUserId,
  getAllOrderByTeacherId,
  updateOrder,
} = require("@/controllers/orders/orders.controller");
const validateRequest = require("@/middleware/validateRequestJoi.middleware");
const { updateOrderSchema } = require("@/validation/orders");
const verifyTokenUser = require("@/middleware/verifyTokenUser");

router.get("/", getAllOrder);
router.get("/id/:orderId", getOrderById);
router.get("/user", verifyTokenUser, getAllOrderByUserId);
router.get("/teacher", verifyTokenUser, getAllOrderByTeacherId);
router.patch("/:orderId", validateRequest(updateOrderSchema), updateOrder);

module.exports = router;
