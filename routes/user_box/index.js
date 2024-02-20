/** @format */

const { Router } = require("express");

const validateRequest = require("@/middleware/validateRequestJoi.middleware");

const {
  createUserBoxSchema,
  updateUserBoxSchema,
} = require("@/validation/user_boxes");
const {
  createUserBox,
  updateUserBox,
  deleteUserBox,
} = require("@/controllers/user_boxes/user_boxes.controller");

const router = Router();

router.post("/", validateRequest(createUserBoxSchema), createUserBox);
router.patch(
  "/:userBoxId",
  validateRequest(updateUserBoxSchema),
  updateUserBox
);
router.patch("/delete/:userBoxId", deleteUserBox);

module.exports = router;
