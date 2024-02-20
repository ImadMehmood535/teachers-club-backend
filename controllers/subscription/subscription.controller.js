/** @format */

const { prisma } = require("@/configs/prisma");

const {
  createSuccessResponse,
  deleteSuccessResponse,
  okResponse,
  badRequestResponse,
  updateSuccessResponse,
} = require("@/constants/responses");
const updateUserBoxService = require("@/services/userBox");
const order_dto = require("@/dto/order");
const create_order = require("@/utils/create_order");
const { resolveTripleslashReference } = require("typescript");
const {
  createPaymentIntent,
  createCustomer,
} = require("@/utils/stripe_helpers");

const getAllSubscriptions = async (req, res, next) => {
  try {
    const result = await prisma.subscribes.findMany({
      include: {
        subscribes_details: {
          include: {
            boxes: true,
            brands: true,
          },
        },
      },
      where: {
        is_paid: true,
      },
    });
    const subscribes = [];
    result.map((i) => {
      const order_details = i.subscribes_details;
      delete subscribes.subscribes_details;
      i.order_details = order_details;
      subscribes.push(order_dto(i));
    });
    const response = okResponse(subscribes);
    return res.status(response.status.code).json(response);
  } catch (error) {
    next(error);
  }
};

const getSubscriptionById = async (req, res, next) => {
  try {
    const { subscriptionId } = req.params;
    const result = await prisma.subscribes.findFirst({
      where: { id: Number(subscriptionId), is_deleted: false },
      include: {
        subscribes_details: {
          include: {
            brands: true,
            boxes: {
              include: {
                box_types: true,
              },
            },
          },
        },
      },
    });
    const order_details = result.subscribes_details;
    delete result.subscribes_details;
    result.order_details = order_details;
    result.packs = order_details.length;
    const response = okResponse(order_dto(result));
    return res.status(response.status.code).json(response);
  } catch (error) {
    next(error);
  }
};

const createSubscription = async (req, res, next) => {
  try {
    const user = req.user;
    if (!user) {
      const response = badRequestResponse("User not found");
      return res.status(response.status.code).json(response);
    }
    if (user.type == "teacher") {
      const response = badRequestResponse("Unauthorized User");
      return res.status(response.status.code).json(response);
    }

    const { first_name, last_name, number, email, shipping_cost, cart } =
      req.body;
    let gross_amount = 0;
    const teacher_cart = [];
    const own_cart = [];
    cart.map((i) => {
      if (i.user_type == "teacher") {
        teacher_cart.push(i);
      } else {
        own_cart.push(i);
      }
      gross_amount += i.price * i.quantity;
    });
    const tax_amount = ((gross_amount + shipping_cost) * 3) / 100;
    const net_amount = gross_amount + shipping_cost + tax_amount;
    let paymentIntentRes = {};

    const { id: customerId } = await createCustomer(user);
    const subscribes = await prisma.subscribes.create({
      data: {
        first_name,
        last_name,
        number,
        email,
        shipping_cost,
        tax_amount,
        net_amount,
        gross_amount,
        customer_id: customerId,
        user_id: Number(user?.id),
      },
    });

    const paymentIntent = await createPaymentIntent(
      Math.ceil(net_amount) * 100,
      { subscribesId: Number(subscribes?.id) },
      customerId
    );
    paymentIntentRes = {
      paymentIntentId: paymentIntent.id,
      clientSecret: paymentIntent.client_secret,
    };

    await Promise.all(
      teacher_cart.map(async (i) => {
        if (i.user_box_id) {
          await updateUserBoxService(i.user_box_id, false, i.quantity);
        }
        await prisma.subscribes_details.create({
          data: {
            subscribe_id: Number(subscribes.id),
            selected_brand_id: i.selected_brand_id,
            box_id: i.id,
            shipper_id: Number(i.user_id),
            type: i.user_type,
            quantity: i.quantity,
            delivery_address: i.shipping_address,
            city: i.city,
            postal_code: i.postal_code,
            height: Number(i.height),
            width: Number(i.width),
            length: Number(i.length),
            weight: Number(i.weight),
          },
        });
      })
    );
    await Promise.all(
      own_cart.map(async (i) => {
        await Promise.all(
          i.shippingAddress.map(async (j) => {
            await Promise.all(
              j.packs.map(async (k) => {
                await prisma.subscribes_details.create({
                  data: {
                    subscribe_id: Number(subscribes.id),
                    selected_brand_id: i.selected_brand_id,
                    box_id: i.id,
                    shipper_id: Number(i.user_id),
                    type: i.user_type,
                    quantity: 1,
                    delivery_address: j.address,
                    city: j.city,
                    postal_code: j.postalCode,
                    height: Number(i.height),
                    width: Number(i.width),
                    length: Number(i.length),
                    weight: Number(i.weight),
                  },
                });
              })
            );
          })
        );
      })
    );

    const response = createSuccessResponse({
      paymentIntentRes,
    });
    return res.status(response.status.code).json(response);
  } catch (error) {
    next(error);
  }
};

const getAllSubscriptionsByUser = async (req, res, next) => {
  try {
    let { dateFilter } = req.query;
    let createdAt = {};
    if (dateFilter) {
      let date = new Date().getMonth() - dateFilter;
      dateFilter = new Date(new Date().setMonth(date)).toISOString();
      let startDate = new Date(
        new Date(new Date(dateFilter).setDate(1)).setHours(0, 0, 0, 0)
      );

      let endDate = new Date(
        new Date(startDate.getFullYear(), startDate.getMonth() + 1, 0).setHours(
          0,
          0,
          0,
          0
        )
      ).toISOString();
      startDate = startDate.toISOString();
      createdAt = { gte: startDate, lte: endDate };
    }
    const user = req.user;
    const result = await prisma.subscribes.findMany({
      where: {
        user_id: user.id,
        is_deleted: false,
        is_paid: true,
        createdAt: { ...createdAt },
      },
      include: {
        subscribes_details: true,
      },
      orderBy: {
        id: "desc",
      },
    });
    const subscription = [];
    result.map((i) => {
      const details = i.subscribes_details;
      delete i.subscribes_details;
      i.packs = details?.length;
      subscription.push(order_dto(i));
    });
    const response = okResponse(subscription);
    return res.status(response.status.code).json(response);
  } catch (error) {
    next(error);
  }
};

const updateSubscriptionDetails = async (req, res, next) => {
  try {
    const { subscriptionDetailId } = req.params;
    const subscriptionDetail = await prisma.subscribes_details.findFirst({
      where: {
        id: Number(subscriptionDetailId),
      },
    });
    if (subscriptionDetail.type == "teacher") {
      const response = badRequestResponse(
        "Address of boxes sponsored to teacher can not be changed"
      );
      return res.status(response.status.code).json(response);
    }
    const subscribes = await prisma.subscribes.findFirst({
      where: {
        id: Number(subscriptionDetail.subscribe_id),
      },
    });

    if (subscribes.is_deleted) {
      const response = badRequestResponse("Order has been deleted");
      return res.status(response.status.code).json(response);
    }

    const { address, city, postal_code } = req.body;
    let obj = {};
    address && (obj.delivery_address = address);
    city && (obj.city = city);
    postal_code && (obj.postal_code = postal_code);
    const result = await prisma.subscribes_details.update({
      where: {
        id: Number(subscriptionDetailId),
      },
      data: {
        ...obj,
      },
    });
    const response = updateSuccessResponse(result);
    return res.status(response.status.code).json(response);
  } catch (error) {
    next(error);
  }
};

const deleteSubscription = async (req, res, next) => {
  try {
    const { subscriptionId } = req.params;
    const result = await prisma.subscribes.update({
      where: {
        id: Number(subscriptionId),
      },
      data: {
        is_deleted: true,
      },
    });

    const response = deleteSuccessResponse(result);
    return res.status(response.status.code).json(response);
  } catch (error) {
    next(error);
  }
};

const deleteUserSubscription = async (req, res, next) => {
  try {
    const { userId } = req.params;
    const result = await prisma.subscribes.updateMany({
      where: {
        user_id: Number(userId),
      },
      data: {
        is_deleted: true,
      },
    });

    const response = deleteSuccessResponse(result);
    return res.status(response.status.code).json(response);
  } catch (error) {
    next(error);
  }
};

module.exports = {
  getAllSubscriptions,
  getSubscriptionById,
  createSubscription,
  getAllSubscriptionsByUser,
  updateSubscriptionDetails,
  deleteSubscription,
  deleteUserSubscription,
};
