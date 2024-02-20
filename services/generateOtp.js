/** @format */

const generateRandomAlphanumericCode = () => {
  const otpLength = 6;
  let otp = "";

  for (let i = 0; i < otpLength; i++) {
    otp += Math.floor(Math.random() * 10); // Generates a random digit (0-9)
  }

  return otp;
};

module.exports = generateRandomAlphanumericCode;
