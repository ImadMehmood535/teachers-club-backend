/** @format */

const order_detail_dto = (data) => {
  return {
    id: data?.id,
    brand: data?.brands?.name || "-",
    box_title: data?.boxes?.title || "-",
    item_name: data?.boxes?.item_name || "-",
    details: data?.boxes?.details || "-",
    price: data?.boxes?.price || "-",
    quantity: data?.quantity || "-",
    image: data?.boxes?.image || "-",
    type: data?.boxes?.box_types?.name || "-",
    delivery_address: data?.delivery_address || "-",
    city: data?.city || "-",
    postal_code: data?.postal_code || "-",
    type: data?.type || "-",
  };
};

module.exports = order_detail_dto;
