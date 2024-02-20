/** @format */

const { prisma } = require("@/configs/prisma");
const { createSuccessResponse } = require("@/constants/responses");
const contactEmail = require("@/email/contact-email");

const contact = async (req, res, next) => {
  try {
    await prisma.contacts.create({
      data: {
        ...req.body,
      },
    });
    await contactEmail(req.body);

    const response = createSuccessResponse(null, "Form submitted successfully");
    return res.status(response.status.code).json(response);
  } catch (error) {
    next(error);
  }
};
module.exports = { contact };
