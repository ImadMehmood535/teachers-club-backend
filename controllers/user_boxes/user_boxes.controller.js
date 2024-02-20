/** @format */

const { prisma } = require("@/configs/prisma");
const {
  createSuccessResponse,
  updateSuccessResponse,
  deleteSuccessResponse,
  badRequestResponse,
  notFound,
} = require("@/constants/responses");
const updateUserBoxService = require("@/services/userBox");

const createUserBox = async (req, res, next) => {
  const { boxId, userId, maxQuantity } = req.body;
  try {
    const user = await prisma.users.findFirst({
      where: { id: Number(userId) },
    });
    if (!user) {
      const response = notFound("User not found.");
      return res.status(response.status.code).json(response);
    }
    if (user.type !== "teacher") {
      const response = badRequestResponse("User not allowed.");
      return res.status(response.status.code).json(response);
    }
    const box = await prisma.boxes.findFirst({
      where: {
        id: Number(boxId),
      },
    });
    if (!box) {
      const response = notFound("Box not found.");
      return res.status(response.status.code).json(response);
    }
    const user_box = await prisma.user_boxes.findFirst({
      where: {
        user_id: Number(userId),
        box_id: Number(boxId),
      },
    });
    let result;
    if (user_box) {
      result = await prisma.user_boxes.update({
        where: {
          id: Number(user_box?.id),
        },
        data: {
          deleted: false,
        },
      });
    } else {
      result = await prisma.user_boxes.create({
        data: {
          user_id: userId,
          box_id: boxId,
          max_quantity: maxQuantity,
        },
      });
    }
    await prisma.user_details.update({
      where: { id: Number(userId) },
      data: { is_sponsored: false },
    });
    const response = createSuccessResponse(result);
    return res.status(response.status.code).json(response);
  } catch (error) {
    next(error);
  }
};

const updateUserBox = async (req, res, next) => {
  const { donated_quantity, max_quantity } = req.body;
  const { userBoxId } = req.params;
  try {
    const result = await updateUserBoxService(
      userBoxId,
      max_quantity,
      donated_quantity
    );
    const response = updateSuccessResponse(result);
    return res.status(response.status.code).json(response);
  } catch (error) {
    next(error);
  }
};

const deleteUserBox = async (req, res, next) => {
  const { userBoxId } = req.params;
  try {
    const user_box = await prisma.user_boxes.findFirst({
      where: {
        id: Number(userBoxId),
      },
    });
    if (user_box.deleted) {
      const response = badRequestResponse("Already Deleted.");
      return res.status(response.status.code).json(response);
    }

    const result = await prisma.user_boxes.update({
      where: {
        id: Number(userBoxId),
      },
      data: {
        deleted: true,
      },
    });

    const user = await prisma.users.findFirst({
      where: { id: Number(user_box.user_id) },
      include: { user_boxes: true, user_details: true },
    });

    let sponsored = true;
    user.user_boxes.forEach((i) => {
      if (i.status == false && i.deleted !== true) {
        sponsored = false;
      }
    });

    await prisma.users.update({
      where: { id: Number(user.id) },
      data: {
        user_details: {
          update: {
            data: { is_sponsored: sponsored },
          },
        },
      },
    });
    const response = deleteSuccessResponse(result);
    return res.status(response.status.code).json(response);
  } catch (error) {
    next(error);
  }
};

module.exports = {
  createUserBox,
  updateUserBox,
  deleteUserBox,
};
