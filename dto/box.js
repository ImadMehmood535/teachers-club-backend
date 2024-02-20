/** @format */

const box_dto = (box, userBox) => {
  return {
    id: box?.id,
    user_box_id: userBox?.id || null,
    user_id: userBox?.user_id || null,
    shipping_address: userBox?.user_details?.address || null,
    city: userBox?.user_details?.city || null,
    postal_code: userBox?.user_details?.postal_code || null,
    height: box?.height,
    width: box?.width,
    length: box?.length,
    weight: box?.weight,
    required_quantity: userBox?.max_quantity || null,
    quantity: userBox?.max_quantity - userBox?.donated_quantity || 1,
    donated_quantity:
      userBox?.donated_quantity == undefined ? null : userBox?.donated_quantity,
    status: userBox?.status == undefined ? null : userBox?.status,
    deleted: userBox?.deleted == undefined ? null : userBox?.deleted,
    title: box?.title,
    item_name: box?.item_name,
    details: box?.details,
    price: box?.price,
    item_quantity: box?.item_quantity,
    type: box?.box_types?.name,
    type_id: box?.box_types?.id,
    image: box?.image,
    createdAt: box?.createdAt,
    updatedAt: box?.updatedAt,
    brands: box?.brands?.map((i) => {
      return { name: i?.name, id: i?.id };
    }),
  };
};

module.exports = box_dto;
