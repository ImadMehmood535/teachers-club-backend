/** @format */

const { Router } = require("express");

const validateRequest = require("@/middleware/validateRequestJoi.middleware");
const {
  createCommunitySchema,
  updateCommunitySchema,
  deleteCommunitySchema,
} = require("@/validation/community");
const verifyToken = require("@/middleware/verifyToken");
const {
  deleteCommunity,
  getAllCommunity,
  createCommunity,
  updateCommunity,
} = require("@/controllers/community/community.controller");

const router = Router();

router.get("/", getAllCommunity);
router.post("/", validateRequest(createCommunitySchema), createCommunity);
router.patch(
  "/:communityId",
  validateRequest(updateCommunitySchema),
  updateCommunity
);
router.delete(
  "/:communityId",
  validateRequest(deleteCommunitySchema),
  deleteCommunity
);

module.exports = router;
