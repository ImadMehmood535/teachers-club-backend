/** @format */

const { Router } = require("express");
const { contact } = require("@/controllers/contact/contact.controller");

const validateRequest = require("@/middleware/validateRequestJoi.middleware");
const { contactSchema } = require("@/validation/contact");
const { createSuccessResponse } = require("@/constants/responses");

const router = Router();
router.get("/", (req, res) => {
  const response = createSuccessResponse(null, "User subscribed successfully");
  return res.status(response.status.code).json(response);
});

router.post("/", validateRequest(contactSchema), contact);

module.exports = router;
