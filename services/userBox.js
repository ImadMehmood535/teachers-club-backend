/** @format */

const { prisma } = require("@/configs/prisma");
const { badRequestResponse, notFound } = require("@/constants/responses");

const updateUserBoxService = async (
  userBoxId,
  max_quantity,
  donated_quantity
) => {
  try {
    const user_box = await prisma.user_boxes.findFirst({
      where: {
        id: Number(userBoxId),
      },
    });
    if (!user_box) {
      const response = notFound("User Box Not Found.");
      throw response;
    }
    if (user_box.deleted) {
      const response = notFound("User Box Deleted.");
      throw response;
    }

    const maxQuantity = max_quantity || user_box.max_quantity; //if max quantity is also updated in the update request
    const donatedQuantity = donated_quantity || 0; //if donated quantity is given in the request
    if (maxQuantity - user_box.donated_quantity < donatedQuantity) {
      const response = badRequestResponse(
        "Donated Quantity must be less than Required Quantity"
      );
      throw response;
    }
    let status = false;
    const total_donated_quantity = user_box.donated_quantity + donatedQuantity;
    if (maxQuantity - user_box.donated_quantity == donatedQuantity) {
      status = true;
    }

    const result = await prisma.user_boxes.update({
      data: {
        donated_quantity: total_donated_quantity,
        max_quantity: maxQuantity,
        status,
      },
      where: {
        id: Number(userBoxId),
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

    return result;
  } catch (error) {
    throw error;
  }
};

module.exports = updateUserBoxService;
