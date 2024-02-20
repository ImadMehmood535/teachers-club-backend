/** @format */

const { prisma } = require("@/configs/prisma");

const update_subscription = async (id, is_paid, is_advance) => {
  try {
    await prisma.subscribes.update({
      where: { is_deleted: false, id: Number(id) },
      data: {
        is_paid,
        is_advance,
      },
    });
  } catch (error) {
    throw error;
  }
};

module.exports = update_subscription;
