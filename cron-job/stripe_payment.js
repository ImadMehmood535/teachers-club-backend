/** @format */

const { prisma } = require("@/configs/prisma");
const create_order = require("@/utils/create_order");
const {
  createPaymentIntent,
  confirmPaymentIntent,
} = require("@/utils/stripe_helpers");
const update_subscription = require("@/utils/update_subscription");
const stripePayment = async () => {
  const res = await prisma.subscribes.findMany({
    where: {
      is_deleted: false,
      is_paid: true,
      is_advance: false,
    },
  });
  Promise.all(
    res.map(async (element) => {
      const paymentIntent = await createPaymentIntent(
        Math.ceil(element.net_amount) * 100,
        { subscribesId: Number(element.id) },
        element.customer_id
      );
      await confirmPaymentIntent(paymentIntent.id);
    })
  );

  const res2 = await prisma.subscribes.findMany({
    where: {
      is_deleted: false,
      is_paid: true,
      is_advance: true,
    },
  });
  Promise.all(
    res2.map(async (element) => {
      create_order(element?.id);
      update_subscription(element?.id, true, false);
    })
  );
};

module.exports = stripePayment;
