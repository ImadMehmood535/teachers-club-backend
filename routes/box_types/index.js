/** @format */

const { Router } = require("express");
const {
  getAllBoxTypes,
  createBoxTypes,
  updateBoxTypes,
} = require("@/controllers/box_types/box_types.controller");

const validateRequest = require("@/middleware/validateRequestJoi.middleware");
const {
  createBoxSchema,
  updateBoxSchema,
  deleteBoxSchema,
} = require("@/validation/box_types");
const restrictToAdmins = require("../../middleware/restrictToAdmins");

const router = Router();

router.get("/", getAllBoxTypes);
router.post("/", validateRequest(createBoxSchema), createBoxTypes);
router.patch("/:id", validateRequest(updateBoxSchema), updateBoxTypes);
// router.delete(
//   "/:tagId",
//   restrictToAdmins,
//   validateRequest(deleteTagSchema),
//   deleteTag
// );

module.exports = router;
