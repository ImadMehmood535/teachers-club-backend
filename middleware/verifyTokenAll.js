/** @format */

const { prisma } = require("@/configs/prisma");

const TokenService = require("@/services/tokenService");

const tokenService = new TokenService(process.env.JWT_SECRET_KEY);

const verifyTokenAll = async (req, res, next) => {
  const { type, admin } = req.query;
  console.log(req.headers.authorization);
  let { access_token } = req.cookies;
  if (!access_token) {
    access_token = req.headers.authorization;
  }
  if (access_token) {
    const id = tokenService.verifyAccessToken(access_token);
    if (id) {
      try {
        const user = admin
          ? await prisma.admins.findFirst({ where: { id } })
          : await prisma.users.findFirst({
              where: {
                id,
                user_details: {
                  is_verified: true,
                },
              },
            });
        if (user) {
          req.user = user;
        }
      } catch (error) {
        console.log("Fetching all");
      }
    }
  }
  next();
};

module.exports = verifyTokenAll;
