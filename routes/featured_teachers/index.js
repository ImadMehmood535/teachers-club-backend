/** @format */

const { Router } = require("express");

const validateRequest = require("@/middleware/validateRequestJoi.middleware");
const verifyToken = require("@/middleware/verifyToken");
const {
  createFaturedTeachers,
  updateFaturedTeachers,
  getAllFaturedTeachers,
  deleteFaturedTeachers,
} = require("@/controllers/featured_teachers/featured_teachers.controller");
const {
  updateFeaturedSchema,
  createFeaturedSchema,
} = require("@/validation/featured_teachers");

const router = Router();

router.get("/", getAllFaturedTeachers);
router.post(
  "/",
  verifyToken,
  validateRequest(createFeaturedSchema),
  createFaturedTeachers
);
router.patch(
  "/:featuredId",
  verifyToken,
  validateRequest(updateFeaturedSchema),
  updateFaturedTeachers
);

router.delete("/:featuredId", verifyToken, deleteFaturedTeachers);

module.exports = router;
