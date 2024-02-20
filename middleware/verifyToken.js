/** @format */

const {
  sessionExpired,
  unauthorizedResponse,
} = require("@/constants/responses");
const TokenService = require("@/services/tokenService");

const tokenService = new TokenService(process.env.JWT_SECRET_KEY);

const verifyToken = (req, res, next) => {
  let { access_token } = req.cookies;
  if (!access_token) {
    access_token = req.headers.authorization;
  }
  if (!access_token) {
    const response = unauthorizedResponse("Cookie not found.");
    return res.status(response.status.code).json(response);
  }
  const id = tokenService.verifyAccessToken(access_token);
  if (!id) {
    const response = sessionExpired("Access Token Expired.");
    res.clearCookie("access_token");
    return res.status(response.status.code).json(response);
  }
  req.id = id;
  next();
};

module.exports = verifyToken;
