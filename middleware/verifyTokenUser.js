/** @format */

const { prisma } = require("@/configs/prisma");
const {
  sessionExpired,
  unauthorizedResponse,
  forbiddenResponse,
} = require("@/constants/responses");
const TokenService = require("@/services/tokenService");

const tokenService = new TokenService(process.env.JWT_SECRET_KEY);

const verifyTokenUser = async (req, res, next) => {
  let { access_token } = req.cookies;
  if (!access_token) {
    access_token = req.headers.authorization;
  }
  if (!access_token) {
    const response = unauthorizedResponse("Cookies not found.");
    return res.status(response.status.code).json(response);
  }
  const id = tokenService.verifyAccessToken(access_token);
  if (!id) {
    const response = sessionExpired("Access Token Expired.");
    res.clearCookie("access_token");
    return res.status(response.status.code).json(response);
  }
  try {
    const user = await prisma.users.findFirst({
      where: {
        id,
        user_details: {
          is_verified: true,
        },
      },
    });
    if (!user) {
      const response = forbiddenResponse("User not found.");
      res.clearCookie("access_token");
      return res.status(response.status.code).json(response);
    } else {
      req.user = user;
    }
  } catch (error) {
    const response = serverErrorResponse(error.message);
    return res.status(response.status.code).json(response);
  }
  next();
};

module.exports = verifyTokenUser;
