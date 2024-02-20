/** @format */

const jwt = require("jsonwebtoken");

class TokenService {
  constructor(secretKey) {
    this.secretKey = secretKey;
  }

  // Generate an access token
  generateAccessToken(user) {
    return jwt.sign({ user }, this.secretKey, { expiresIn: "7d" }); // Expires in 30 minutes
  }

  // Generate a refresh token
  generateRefreshToken(user) {
    return jwt.sign({ user }, this.secretKey, { expiresIn: "7d" }); // Expires in 7 days
  }

  // Verify and decode the access token
  verifyAccessToken(accessToken) {
    try {
      const decoded = jwt.verify(accessToken, this.secretKey);
      return decoded.user;
    } catch (error) {
      return null; // Token verification failed
    }
  }

  // Refresh the access token using the refresh token
  refreshAccessToken(refreshToken) {
    try {
      const decoded = jwt.verify(refreshToken, this.secretKey);
      const user = decoded.user;
      return this.generateAccessToken(user);
    } catch (error) {
      return null; // Token verification failed
    }
  }
}

module.exports = TokenService;
