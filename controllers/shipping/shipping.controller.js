/** @format */

const { prisma } = require("@/configs/prisma");
const { okResponse } = require("@/constants/responses");
const get_qoute = require("@/xps_shipping/get_quote");
const get_quote_details = require("@/xps_shipping/get_quote_details");

const getShippingCost = async (req, res, next) => {
  try {
    const boxes = req.body;
    const arr = await get_quote_details(boxes);
    const shipping_cost = await get_qoute(arr);
    let response = okResponse({ shipping_cost });

    return res.status(response.status.code).json(response);
  } catch (error) {
    next(error);
  }
};

module.exports = {
  getShippingCost,
};
