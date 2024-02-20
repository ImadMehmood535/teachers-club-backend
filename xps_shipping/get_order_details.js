/** @format */

const { prisma } = require("../configs/prisma");
const confirm_order = require("./confirm_order");

const get_order_details = async (order, order_id) => {
  console.log(order_id, "order Id");
  const res = await prisma.subscribes_details.findMany({
    distinct: ["city", "postal_code", "delivery_address"],
    where: {
      subscribe_id: Number(order?.id),
    },
  });
  await Promise.all(
    res.map(async (i) => {
      const arr = [];
      const res2 = await prisma.subscribes_details.findMany({
        where: {
          city: i?.city,
          postal_code: i?.postal_code,
          delivery_address: i?.delivery_address,
          subscribe_id: i?.subscribe_id,
        },
      });
      res2.map((j) => {
        arr.push({
          productId: `${j?.box_id}`,
          sku: ``,
          title: ``,
          price: "0",
          quantity: j?.quantity,
          imgUrl: ``,
          htsNumber: ``,
          countryOfOrigin: "US",
          lineId: "",
          weight: `${j?.weight}`,
        });
      });
      await confirm_order(order, i, arr, order_id);
    })
  );
};

module.exports = get_order_details;
