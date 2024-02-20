/** @format */

const { Router } = require("express");
const router = Router();

const validateRequest = require("@/middleware/validateRequestJoi.middleware");
const restrictToAdmins = require("../../middleware/restrictToAdmins");
const verifyTokenUser = require("@/middleware/verifyTokenUser");
const {
  getAllSubscriptions,
  getAllSubscriptionsByUser,
  getSubscriptionById,
  createSubscription,
  updateSubscriptionDetails,
  deleteSubscription,
  deleteUserSubscription,
} = require("@/controllers/subscription/subscription.controller");
const {
  updateSubscriptionDetailSchema,
  createSubscriptionSchema,
} = require("@/validation/subscriptions");
const verifyToken = require("@/middleware/verifyToken");

router.get("/", verifyToken, getAllSubscriptions);
router.get("/user", verifyTokenUser, getAllSubscriptionsByUser);

router.get("/id/:subscriptionId", getSubscriptionById);
router.post(
  "/",
  verifyTokenUser,
  validateRequest(createSubscriptionSchema),
  createSubscription
);
router.patch(
  "/:subscriptionDetailId",
  validateRequest(updateSubscriptionDetailSchema),
  updateSubscriptionDetails
);
router.patch("/delete/:subscriptionId", verifyTokenUser, deleteSubscription);
router.delete("/delete/user/:userId", deleteUserSubscription);

module.exports = router;
