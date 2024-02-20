/** @format */

const box_dto = require("./box");

const user_dto = (user) => {
  return {
    id: user?.id,
    email: user?.email,
    type: user?.type,
    firstname: user?.user_details?.firstname,
    lastname: user?.user_details?.lastname,
    address: user?.user_details?.address,
    city: user?.user_details?.city,
    postal_code: user?.user_details?.postal_code,
    phone: user?.user_details?.phone,
    image: user?.user_details?.image,
    is_sponsored: user?.user_details?.is_sponsored,
    is_approved: user?.user_details?.is_approved,
    is_featured: user?.user_details?.is_featured,
    requirement_description: user?.user_details?.requirement_description,
    requirement_details: user?.user_details?.requirement_details,
    requirements: user?.user_details?.requirements,
    current_institute: user?.user_details?.current_institute,
    createdAt: user?.createdAt,
    updatedAt: user?.updatedAt,
    user_box: user?.user_boxes?.map((i) => {
      return box_dto(i?.boxes, i);
    }),
  };
};

module.exports = user_dto;
