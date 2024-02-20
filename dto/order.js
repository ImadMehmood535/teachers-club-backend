/** @format */

const order_detail_dto = require("./orderDetail");

const order_dto = (order) => {
  return {
    id: order?.id,
    subscription_id: order?.subscription_id || "-",
    packs: order?.packs || "-",
    first_name: order?.first_name,
    email: order?.email,
    last_name: order?.last_name,
    number: order?.number,
    status: order?.status,
    tax_amount: order?.tax_amount,
    shipping_cost: order?.shipping_cost,
    gross_amount: order?.gross_amount,
    net_amount: order?.net_amount,
    is_advance: order?.is_advance,
    created_at: order?.createdAt,
    placed: order?.placed || "-",
    dispatched: order?.dispatched || "-",
    transit: order?.transit || "-",
    delivered: order?.delivered || "-",
    status: order?.status || "-",
    order_details:
      order?.order_details?.map((i) => {
        return order_detail_dto(i);
      }) || null,
  };
};

module.exports = order_dto;
