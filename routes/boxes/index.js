/** @format */

const { Router } = require("express");
const {
  getAllBoxes,
  getBoxById,
  createBox,
  updateBox,
  deleteBox,
} = require("@/controllers/boxes/boxes.controller");
const validateRequest = require("@/middleware/validateRequestJoi.middleware");
const { updateBoxSchema, createBoxSchema } = require("@/validation/boxes");
const restrictToAdmins = require("../../middleware/restrictToAdmins");

const router = Router();

router.get("/", getAllBoxes);
router.get("/:boxId", getBoxById);
router.post("/", validateRequest(createBoxSchema), createBox);
router.patch(
  "/:boxId",

  validateRequest(updateBoxSchema),
  updateBox
);
router.delete("/:boxId", deleteBox);


module.exports = router;
