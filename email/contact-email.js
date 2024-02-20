/** @format */

const transporter = require("@/configs/email");
const { logger } = require("../configs/logger");

const contactEmail = async (data) => {
  const mailOptions = {
    to: data.email,
    subject: data.subject,
    html: data?.html,
  };
  try {
    const info = await transporter.sendMail(mailOptions);
    logger.info(`Email sent: ${info.response}`);
  } catch (error) {
    logger.error(error);
    throw new Error("Error while sending Email");
  }
};

module.exports = contactEmail;
