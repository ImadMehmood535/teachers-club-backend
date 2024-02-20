/** @format */

const generateRandomAlphanumericCode = require("@/services/generateOtp");
const { prisma } = require("../../configs/prisma");

const {
  serverErrorResponse,
  okResponse,
  badRequestResponse,
  forbiddenResponse,
  unauthorizedResponse,
} = require("../../constants/responses");
const TokenService = require("@/services/tokenService");
const contactEmail = require("@/email/contact-email");
const tokenService = new TokenService(process.env.JWT_SECRET_KEY);

const loginAdmin = async (req, res) => {
  const { email, password } = req.body;

  try {
    const admin = await prisma.admins.findFirst({
      where: {
        email,
      },
    });

    if (!admin) {
      const response = badRequestResponse("Invalid credentials.");
      return res.status(response.status.code).json(response);
    }

    if (password !== admin?.password) {
      const response = badRequestResponse("Invalid credentials.");
      return res.status(response.status.code).json(response);
    }

    const access_token = tokenService.generateAccessToken(admin.id);
    const refresh_token = tokenService.generateRefreshToken(admin.id);

    const browser = req.headers["user-agent"];
    const ip_address = req.ip;

    const user_session = await prisma.admin_sessions.create({
      data: {
        admin_id: admin.id,
        ip_address,
        browser,
        refresh_token,
      },
    });

    const response = okResponse(
      { access_token, refresh_token },
      "Admin login successful."
    );
    res.cookie("access_token", access_token, {
      httpOnly: true,
      maxAge: 30 * 60 * 1000,
    });
    res.cookie("refresh_token", refresh_token, {
      httpOnly: true,
      maxAge: 7 * 24 * 60 * 60 * 1000,
    });
    return res.status(response.status.code).json(response);
  } catch (error) {
    const response = serverErrorResponse(error.message);
    return res.status(response.status.code).json(response);
  }
};

const logoutAdmin = async (req, res) => {
  const { refresh_token } = req.cookies;
  const { id } = req;
  try {
    const admin = await prisma.admins.findFirst({
      where: {
        id,
      },
    });

    if (!admin) {
      const response = badRequestResponse("Invalid credentials.");
      return res.status(response.status.code).json(response);
    }

    const user_session = await prisma.admin_sessions.deleteMany({
      where: {
        refresh_token,
      },
    });

    const response = okResponse({ user_session }, "Admin logout successful.");
    res.clearCookie("access_token");
    res.clearCookie("refresh_token");
    return res.status(response.status.code).json(response);
  } catch (error) {
    const response = serverErrorResponse(error.message);
    return res.status(response.status.code).json(response);
  }
};

const refreshAdmin = async (req, res) => {
  let { refresh_token } = req.cookies;
  if (!refresh_token) {
    refresh_token = req.headers.authorization;
  }
  if (!refresh_token) {
    const response = unauthorizedResponse("Cookie not found.");
    return res.status(response.status.code).json(response);
  }
  try {
    const access_token = tokenService.refreshAccessToken(refresh_token);
    if (!access_token) {
      const response = unauthorizedResponse("Refresh Token invalid.");
      return res.status(response.status.code).json(response);
    }
    res.cookie("access_token", access_token, {
      httpOnly: true,
      maxAge: 30 * 60 * 1000,
    });

    const response = okResponse(
      { access_token },
      "New Access Token generated successfully."
    );

    return res.status(response.status.code).json(response);
  } catch (error) {
    const response = serverErrorResponse(error.message);
    return res.status(response.status.code).json(response);
  }
};

const registerAdmin = async (req, res) => {
  const { email, phone, name, address, image, password } = req.body;

  try {
    let admin = await prisma.admins.findFirst({
      where: {
        email,
      },
    });
    if (admin) {
      const response = forbiddenResponse("Email already taken.");
      return res.status(response.status.code).json(response);
    }

    admin = await prisma.admins.create({
      data: {
        email,
        password,
        admin_details: {
          create: {
            phone,
            name,
            address,
            image,
          },
        },
      },
    });

    const response = okResponse({ admin }, "Admin created successfully.");
    return res.status(response.status.code).json(response);
  } catch (error) {
    const response = serverErrorResponse(error.message);
    return res.status(response.status.code).json(response);
  }
};

const forgetPassword = async (req, res) => {
  const { email } = req.body;
  try {
    let user = await prisma.admins.findFirst({
      where: {
        email,
      },
      include: {
        admin_details: true,
      },
    });
    if (user) {
      const otp = generateRandomAlphanumericCode(6);
      user = await prisma.admins.update({
        where: {
          id: user.id,
        },
        data: {
          admin_details: {
            update: {
              image: otp,
              verified: false,
            },
          },
        },
      });
      await contactEmail({
        email,
        html: ` <p>Hi, ${user?.admin_details?.firstname}</p>
        <p>This is your OTP <span style="font-weight:bold;color:blue; font-size:large;">${otp}</span></p>`,
        subject: "One Time Password (OTP)",
      });
      const response = okResponse(
        "Otp has been sent to this email. Please verify"
      );
      return res.status(response.status.code).json(response);
    } else {
      const response = badRequestResponse("Invalid user.");
      return res.status(response.status.code).json(response);
    }
  } catch (error) {
    const response = serverErrorResponse(error.message);
    return res.status(response.status.code).json(response);
  }
};

const resendOtp = async (req, res) => {
  const { email } = req.body;

  try {
    let user = await prisma.admins.findFirst({
      where: {
        email,
      },
      include: {
        admin_details: true,
      },
    });
    if (!user) {
      const response = notFound("User not Valid.");
      return res.status(response.status.code).json(response);
    }
    if (user?.admin_details?.verified) {
      const response = forbiddenResponse("Email already taken.");
      return res.status(response.status.code).json(response);
    }

    const otp = generateRandomAlphanumericCode(6);

    user = await prisma.admins.update({
      data: {
        admin_details: {
          update: {
            image: otp,
          },
        },
      },
      where: {
        id: user.id,
      },
    });

    await contactEmail({
      email,
      html: ` <p>Hi, ${user?.admin_details?.firstname}</p>
      <p>This is your OTP <span style="font-weight:bold;color:blue; font-size:large;">${otp}</span></p>`,
      subject: "One Time Password (OTP)",
    });

    const response = okResponse("Otp Sent successfully. Please verify otp");
    return res.status(response.status.code).json(response);
  } catch (error) {
    const response = serverErrorResponse(error.message);
    return res.status(response.status.code).json(response);
  }
};

const changePassword = async (req, res) => {
  const { password, old_password } = req.body;
  const id = req.id;
  if (!id) {
    const response = unauthorizedResponse("User Not Found.");
    return res.status(response.status.code).json(response);
  }
  const user = await prisma.admins.findFirst({
    where: {
      id: Number(id),
    },
  });
  if (user?.password !== old_password) {
    const response = unauthorizedResponse("Incorrect Password.");
    return res.status(response.status.code).json(response);
  }
  try {
    await prisma.admins.update({
      where: {
        id: Number(id),
      },
      data: {
        password,
      },
    });
    const response = okResponse("Password changed successfully.");
    return res.status(response.status.code).json(response);
  } catch (error) {
    const response = serverErrorResponse(error.message);
    return res.status(response.status.code).json(response);
  }
};

const resetPassword = async (req, res) => {
  const { password, otp, email } = req.body;
  try {
    const user = await prisma.admins.findFirst({
      where: {
        email,
      },
      include: {
        admin_details: true,
      },
    });

    if (user?.admin_details?.image !== otp) {
      const response = badRequestResponse("OTP is not valid");
      return res.status(response.status.code).json(response);
    }

    await prisma.admins.update({
      where: {
        id: Number(user?.id),
      },
      data: {
        password,
        admin_details: {
          update: {
            image: "",
            verified: true,
          },
        },
      },
    });

    const response = okResponse("Password changed successfully.");
    return res.status(response.status.code).json(response);
  } catch (error) {
    const response = serverErrorResponse(error.message);
    return res.status(response.status.code).json(response);
  }
};

module.exports = {
  loginAdmin,
  registerAdmin,
  logoutAdmin,
  refreshAdmin,
  forgetPassword,
  resendOtp,
  changePassword,
  resetPassword,
};
