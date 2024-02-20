/** @format */

const { prisma } = require("@/configs/prisma");
const get_order_details = require("@/xps_shipping/get_order_details");

const create_order = async (id) => {
  try {
    const i = await prisma.subscribes.findFirst({
      where: { is_deleted: false, id: Number(id) },
      include: {
        subscribes_details: true,
      },
    });

    const subscribe = { ...i };

    const details = i?.subscribes_details;
    i.subscription_id = Number(id);
    delete i.id;
    delete i.customer_id;
    delete i.payment_intent_id;
    delete i.subscribes_details;
    delete i.is_deleted;
    delete i.updatedAt;
    delete i.is_paid;
    delete i.is_advance;
    i.status = "placed";
    const res2 = await prisma.orders.create({
      data: { ...i },
    });

    await Promise.all(
      details?.map(async (j) => {
        delete j.createdAt;
        delete j.id;
        delete j.height;
        delete j.width;
        delete j.length;
        delete j.weight;
        delete j.updatedAt;
        delete j.subscribe_id;
        j.order_id = res2.id;
        await prisma.order_details.create({
          data: { ...j },
        });
      })
    );

    await get_order_details(subscribe, res2.id); //create orders in xps
  } catch (error) {
    throw error;
  }
};

module.exports = create_order;
