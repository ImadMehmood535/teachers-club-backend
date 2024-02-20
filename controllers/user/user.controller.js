/** @format */

const generateRandomAlphanumericCode = require("@/services/generateOtp");
const { prisma } = require("../../configs/prisma");

const {
  serverErrorResponse,
  okResponse,
  badRequestResponse,
  forbiddenResponse,
  unauthorizedResponse,
  sessionExpired,
  notFound,
} = require("../../constants/responses");
const TokenService = require("@/services/tokenService");
const box_dto = require("@/dto/box");
const user_dto = require("@/dto/user");
const contactEmail = require("@/email/contact-email");
const sendOtpEmail = require("@/email/sendOtp");
const tokenService = new TokenService(process.env.JWT_SECRET_KEY);

const loginUser = async (req, res) => {
  const { email, password } = req.body;

  try {
    const user = await prisma.users.findFirst({
      where: {
        email,
      },
      include: {
        user_details: true,
      },
    });

    if (!user) {
      const response = badRequestResponse("Invalid credentials.");
      return res.status(response.status.code).json(response);
    }

    if (password !== user?.password) {
      const response = badRequestResponse("Invalid credentials.");
      return res.status(response.status.code).json(response);
    }

    if (user.type == "teacher") {
      if (!user?.user_details?.is_approved) {
        const response = badRequestResponse(
          "Not yet approved or being blocked by the admin."
        );
        return res.status(response.status.code).json(response);
      }
    } else {
      if (user?.user_details?.is_approved) {
        const response = badRequestResponse("You are blocked by the admin.");
        return res.status(response.status.code).json(response);
      }
    }

    const access_token = tokenService.generateAccessToken(user.id);
    const refresh_token = tokenService.generateRefreshToken(user.id);

    const browser = req.headers["user-agent"];
    const ip_address = req.ip;

    await prisma.user_sessions.create({
      data: {
        user_id: user.id,
        ip_address,
        browser,
        refresh_token,
      },
    });

    const response = okResponse(
      { access_token, refresh_token, user: user_dto(user) },
      "User login successful."
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

const logoutUser = async (req, res) => {
  // let { refresh_token } = req.cookies;
  let refresh_token = req?.header?.refresh_token;
  const { id } = req;
  try {
    const user = await prisma.users.findFirst({
      where: {
        id,
      },
    });

    if (!user) {
      const response = badRequestResponse("Invalid credentials.");
      return res.status(response.status.code).json(response);
    }
    const user_session = await prisma.user_sessions.deleteMany({
      where: {
        refresh_token,
      },
    });

    const response = okResponse({ user_session }, "User logout successful.");
    res.clearCookie("access_token");
    res.clearCookie("refresh_token");
    return res.status(response.status.code).json(response);
  } catch (error) {
    const response = serverErrorResponse(error.message);
    return res.status(response.status.code).json(response);
  }
};

const refreshUser = async (req, res) => {
  let { refresh_token } = req.cookies;
  refresh_token = req.body.refresh_token;
  try {
    const access_token = tokenService.refreshAccessToken(refresh_token);
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

const changePassword = async (req, res) => {
  const { password, old_password } = req.body;
  let user = req.user;
  if (user?.password !== old_password) {
    const response = unauthorizedResponse("Incorrect Password.");
    return res.status(response.status.code).json(response);
  }
  try {
    user = await prisma.users.update({
      where: {
        id: Number(user?.id),
      },
      data: {
        password,
      },
    });
    const response = okResponse(
      user_dto(user),
      "User password changed successfully."
    );
    return res.status(response.status.code).json(response);
  } catch (error) {
    const response = serverErrorResponse(error.message);
    return res.status(response.status.code).json(response);
  }
};

const resetPassword = async (req, res) => {
  const { password } = req.body;
  let { access_token_change_password } = req.cookies;
  access_token_change_password = req.body.access_token_change_password;
  if (!access_token_change_password) {
    const response = unauthorizedResponse("Cookie not found.");
    return res.status(response.status.code).json(response);
  }
  const id = tokenService.verifyAccessToken(access_token_change_password);
  if (!id) {
    const response = sessionExpired("Access Token Expired.");
    return res.status(response.status.code).json(response);
  }
  try {
    let user = await prisma.users.update({
      where: {
        id,
      },
      data: {
        password,
      },
    });

    res.clearCookie("access_token_change_password");
    const response = okResponse(
      { user },
      "User password changed successfully."
    );
    return res.status(response.status.code).json(response);
  } catch (error) {
    const response = serverErrorResponse(error.message);
    return res.status(response.status.code).json(response);
  }
};

const verifyOtp = async (req, res) => {
  const { otp } = req.body;
  let { access_token_otp } = req.cookies;
  access_token_otp = req.body.access_token_otp;
  const { changePassword } = req.query;
  if (!access_token_otp) {
    const response = unauthorizedResponse("Cookie not found.");
    return res.status(response.status.code).json(response);
  }
  const id = tokenService.verifyAccessToken(access_token_otp);
  if (!id) {
    const response = sessionExpired("Access Token Expired.");
    return res.status(response.status.code).json(response);
  }

  try {
    let user = await prisma.users.findFirst({
      where: {
        id,
      },
      include: {
        user_details: true,
      },
    });
    if (user.user_details.otp == otp) {
      user = await prisma.users.update({
        where: {
          id,
        },
        data: {
          user_details: {
            update: {
              is_verified: true,
              otp: "",
            },
          },
        },
      });
    } else {
      const response = badRequestResponse("Invalid otp.");
      return res.status(response.status.code).json(response);
    }
    let obj = { user };
    if (changePassword) {
      const access_token_change_password = tokenService.generateAccessToken(
        user.id
      );
      obj = { user, access_token_change_password };
      res.cookie("access_token_change_password", access_token_change_password, {
        httpOnly: true,
        maxAge: 30 * 60 * 1000,
      });
    }
    res.clearCookie("access_token_otp");
    const response = okResponse(obj, "User otp verified.");
    return res.status(response.status.code).json(response);
  } catch (error) {
    const response = serverErrorResponse(error.message);
    return res.status(response.status.code).json(response);
  }
};

const forgetPassword = async (req, res) => {
  const { email } = req.body;
  try {
    let user = await prisma.users.findFirst({
      where: {
        email,
      },
      include: {
        user_details: true,
      },
    });
    if (user) {
      const otp = generateRandomAlphanumericCode(6);
      user = await prisma.users.update({
        where: {
          id: user.id,
        },
        data: {
          user_details: {
            update: {
              otp,
              is_verified: false,
            },
          },
        },
      });
      await contactEmail({
        email,
        html: ` <p>Hi, ${user?.user_details?.firstname}</p>
        <p>This is your OTP <span style="font-weight:bold;color:blue; font-size:large;">${otp}</span></p>`,
        subject: "One Time Password (OTP)",
      });
      const access_token_otp = tokenService.generateAccessToken(user.id);
      res.cookie("access_token_otp", access_token_otp, {
        httpOnly: true,
        maxAge: 30 * 60 * 1000,
      });
      const response = okResponse(
        { access_token_otp },
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

const registerUser = async (req, res) => {
  const {
    email,
    phone,
    firstname,
    lastname,
    current_institute,
    address,
    image,
    password,
    type,
    city,
    postal_code,
  } = req.body;

  try {
    let user = await prisma.users.findFirst({
      where: {
        email,
      },
      include: {
        user_details: true,
      },
    });
    if (user?.user_details?.is_verified) {
      const response = forbiddenResponse("Email already taken.");
      return res.status(response.status.code).json(response);
    }

    const otp = generateRandomAlphanumericCode(6);
    if (!user) {
      user = await prisma.users.create({
        data: {
          email,
          password,
          type,
          user_details: {
            create: {
              phone,
              firstname,
              lastname,
              current_institute: current_institute || null,
              address,
              image,
              city,
              postal_code,
              otp,
            },
          },
        },
      });
    } else {
      user = await prisma.users.update({
        data: {
          email,
          password,
          type,
          user_details: {
            update: {
              phone,
              firstname,
              lastname,
              current_institute: current_institute || null,
              address,
              image,
              city,
              postal_code,
              otp,
            },
          },
        },
        where: {
          id: user.id,
        },
      });
    }

    await sendOtpEmail({
      email,
      subject: "One Time Password (OTP)",
      html: ` <p>Hi, ${firstname}</p>
      <p>This is your OTP <span style="font-weight:bold;color:blue; font-size:large;">${otp}</span>, please verify your account</p>`,
    });

    const access_token_otp = tokenService.generateAccessToken(user.id);
    res.cookie("access_token_otp", access_token_otp, {
      httpOnly: true,
      maxAge: 30 * 60 * 1000,
    });
    const response = okResponse(
      { user, access_token_otp },
      "User created successfully. Please verify otp"
    );
    return res.status(response.status.code).json(response);
  } catch (error) {
    const response = serverErrorResponse(error.message);
    return res.status(response.status.code).json(response);
  }
};

const resendOtp = async (req, res) => {
  const { email } = req.body;

  try {
    let user = await prisma.users.findFirst({
      where: {
        email,
      },
      include: {
        user_details: true,
      },
    });
    if (!user) {
      const response = notFound("User not Valid.");
      return res.status(response.status.code).json(response);
    }
    if (user?.user_details?.is_verified) {
      const response = forbiddenResponse("Email already taken.");
      return res.status(response.status.code).json(response);
    }

    const otp = generateRandomAlphanumericCode(6);

    user = await prisma.users.update({
      data: {
        user_details: {
          update: {
            otp,
          },
        },
      },
      where: {
        id: user.id,
      },
    });

    await contactEmail({
      email,
      html: ` <p>Hi, ${user?.user_details?.firstname}</p>
      <p>This is your OTP <span style="font-weight:bold;color:blue; font-size:large;">${otp}</span></p>`,
      subject: "One Time Password (OTP)",
    });

    const access_token_otp = tokenService.generateAccessToken(user.id);
    res.cookie("access_token_otp", access_token_otp, {
      httpOnly: true,
      maxAge: 30 * 60 * 1000,
    });
    const response = okResponse(
      { user, access_token_otp },
      "User created successfully. Please verify otp"
    );
    return res.status(response.status.code).json(response);
  } catch (error) {
    const response = serverErrorResponse(error.message);
    return res.status(response.status.code).json(response);
  }
};

const getAllUsers = async (req, res) => {
  let { type, admin } = req.query;
  const user_details_obj = { is_verified: true };
  if (req?.user && req?.user?.type === "teacher") {
    type = "teacher";
  }
  if (type == "teacher" && !admin) {
    user_details_obj["is_approved"] = true;
  }
  console.log(req?.user);
  try {
    let users = await prisma.users.findMany({
      where: {
        type,
        user_details: { ...user_details_obj },
      },
      include: {
        user_details: true,
        user_boxes: {
          include: {
            boxes: {
              include: {
                box_types: true,
              },
            },
          },
          where: {
            deleted: false,
          },
        },
      },
    });
    if (type == "teacher") {
      // Assuming 'users' is an array of user objects
      const userPromises = users.map(async (user, index) => {
        const views = await prisma.user_profile_views.findMany({
          where: {
            user_id: user.id,
          },
        });
        users[index].views = views;
      });

      // Use Promise.all to wait for all async operations to complete
      await Promise.all(userPromises);
    }
    const result = [];
    users?.map((i) => result.push(user_dto(i)));

    const response = okResponse({ users: result }, "All users");
    return res.status(response.status.code).json(response);
  } catch (error) {
    const response = serverErrorResponse(error.message);
    return res.status(response.status.code).json(response);
  }
};

const getUserById = async (req, res) => {
  const { userId } = req.params;
  let viewerId;
  if (req?.user && req?.user?.type !== "parent") {
    viewerId = req?.user?.id;
    type = "teacher";
  }
  try {
    let user = await prisma.users.findFirst({
      where: {
        id: Number(userId),
        user_details: {
          is_verified: true,
        },
      },
      include: {
        user_details: true,
      },
    });

    if (!user) {
      const response = notFound("User not Valid.");
      return res.status(response.status.code).json(response);
    }
    if (viewerId) {
      const alreadyViewed = await prisma.user_profile_views.findFirst({
        where: {
          user_id: Number(userId),
          viewer_id: Number(viewerId),
        },
      });
      if (!alreadyViewed) {
        await prisma.user_profile_views.create({
          data: {
            user_id: Number(userId),
            viewer_id: Number(viewerId),
          },
        });
      }
    }

    user = user_dto(user);

    const views = await prisma.user_profile_views.findMany({
      where: {
        user_id: Number(userId),
      },
      include: {
        users_user_profile_views_viewer_idTousers: true,
      },
    });

    user.views = views.map((i) => {
      return {
        email: i?.users_user_profile_views_viewer_idTousers.email,
        type: i?.users_user_profile_views_viewer_idTousers.type,
      };
    });
    const brands = await prisma.brands.findMany();
    let boxes = await prisma.user_boxes.findMany({
      where: {
        user_id: Number(userId),
        NOT: { deleted: true },
      },
      include: {
        users: {
          include: { user_details: true },
        },
        boxes: {
          include: {
            box_types: true,
          },
        },
      },
    });
    const user_details = await prisma.user_details.findFirst({
      where: { userId: Number(userId) },
    });

    boxes = boxes.map((box) => {
      if (box.boxes.is_brand) {
        box.boxes.brands = brands;
      }
      box.user_details = user_details;
      return box_dto(box.boxes, box);
    });
    user.boxes = boxes;

    const response = okResponse(user, "User Data");
    return res.status(response.status.code).json(response);
  } catch (error) {
    const response = serverErrorResponse(error.message);
    return res.status(response.status.code).json(response);
  }
};

const editUser = async (req, res) => {
  const { userId } = req.params;
  const {
    email,
    password,
    image,
    phone,
    city,
    postal_code,
    firstname,
    lastname,
    current_institute,
    address,
    requirements,
    requirement_description,
    requirement_details,
    is_sponsored,
    is_approved,
    is_featured,
  } = req.body;
  try {
    const data = {};
    email && (data.email = email);
    password && (data.password = password);
    const detailData = {};
    image && (detailData.image = image);
    city && (detailData.city = city);
    postal_code && (detailData.postal_code = postal_code);
    phone && (detailData.phone = phone);
    firstname && (detailData.firstname = firstname);
    lastname && (detailData.lastname = lastname);
    current_institute && (detailData.current_institute = current_institute);
    address && (detailData.address = address);
    requirements && (detailData.requirements = requirements);
    requirement_description &&
      (detailData.requirement_description = requirement_description);
    (is_sponsored !== undefined || null) &&
      (detailData.is_sponsored = is_sponsored);
    (is_approved !== undefined || null) &&
      (detailData.is_approved = is_approved);
    (is_featured !== undefined || null) &&
      (detailData.is_featured = is_featured);
    requirement_details &&
      (detailData.requirement_details = requirement_details);

    const user = await prisma.users.update({
      where: {
        id: Number(userId),
      },
      data: {
        ...data,
        user_details: {
          update: {
            where: { userId: Number(userId) },
            data: { ...detailData },
          },
        },
      },
      include: {
        user_details: true,
      },
    });
    const response = okResponse(user_dto(user), "User updated successful.");
    return res.status(response.status.code).json(response);
  } catch (error) {
    const response = serverErrorResponse(error.message);
    return res.status(response.status.code).json(response);
  }
};

module.exports = {
  loginUser,
  registerUser,
  logoutUser,
  refreshUser,
  verifyOtp,
  resendOtp,
  forgetPassword,
  changePassword,
  resetPassword,
  getAllUsers,
  getUserById,
  editUser,
};
