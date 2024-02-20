/** @format */

const { prisma } = require("@/configs/prisma");

const {
  okResponse,
  badRequestResponse,
  updateSuccessResponse,
} = require("@/constants/responses");

const order_dto = require("@/dto/order");

const getAllOrder = async (req, res, next) => {
  try {
    const result = await prisma.orders.findMany({
      include: {
        order_details: {
          include: { boxes: true, brands: true },
        },
      },
    });
    const order = [];
    result.map((i) => order.push(order_dto(i)));
    const response = okResponse(order);
    return res.status(response.status.code).json(response);
  } catch (error) {
    next(error);
  }
};

const getOrderById = async (req, res, next) => {
  try {
    const { orderId } = req.params;
    const result = await prisma.orders.findFirst({
      where: { id: Number(orderId) },
      include: {
        order_details: {
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

    const response = okResponse(order_dto(result));
    return res.status(response.status.code).json(response);
  } catch (error) {
    next(error);
  }
};

const getAllOrderByUserId = async (req, res, next) => {
  try {
    let { status, dateFilter } = req.query;
    if (dateFilter) {
      let date = new Date().getDate() - dateFilter;
      dateFilter = new Date(new Date().setDate(date)).toISOString();
    }
    const user = req.user;
    let result;
    let orders = [];
    //status is not given returning all orders which has not been delivered and date filter is not given
    if (!status) {
      result = await prisma.orders.findMany({
        where: {
          user_id: user.id,
          NOT: { status: "delivered" },
          placed: {
            gte: dateFilter,
          },
        },
        orderBy: {
          id: "desc",
        },
        include: {
          order_details: true,
        },
      });
      result.map((i) => {
        const details = i.order_details;
        delete i.order_details;
        i.packs = details?.length;
        orders.push(order_dto(i));
      });
    }
    //status is given returning all orders on the basis of status not currently using this
    else if (status !== "delivered") {
      result = await prisma.orders.findMany({
        where: {
          user_id: user.id,
          status,
        },
        include: {
          order_details: true,
        },
      });
      result.map((i) => {
        const details = i.order_details;
        delete i.order_details;
        i.packs = Number(details?.length);
        orders.push(order_dto(i));
      });
    }
    //status is given returning all orders on the basis of status and date filter
    else {
      if (dateFilter) {
        //     result = await prisma.$queryRaw`SELECT
        //     *,SUM(o.id)/o.id as packs
        // FROM
        //   orders AS o
        //   JOIN order_details as od ON o.id = od.order_id
        // WHERE
        //     o.user_id = ${user.id}
        //     AND o.delivered >= ${dateFilter}
        //     AND o.status = ${status}
        // GROUP BY o.id
        // ORDER BY (o.id) DESC
        // `;
        result = await prisma.orders.findMany({
          where: {
            status,
            user_id: user?.id,
            delivered: {
              gte: dateFilter,
            },
          },
          orderBy: {
            id: "desc",
          },
        });
      }
      //status is given returning all orders on the basis of status without date filter
      else {
        //     result = await prisma.$queryRaw`SELECT
        //     *,SUM(o.id)/o.id as packs
        // FROM
        //   orders AS o
        //   JOIN order_details as od ON o.id = od.order_id
        // WHERE
        //     o.user_id = ${user.id}
        //     AND o.status = ${status}
        // GROUP BY o.id,
        // ORDER BY o.id DESC
        // `;
        result = await prisma.orders.findMany({
          where: {
            status,
            user_id: user?.id,
          },
          orderBy: {
            id: "desc",
          },
        });
      }
      result.map((i) => {
        orders.push(order_dto(i));
      });
    }
    const response = okResponse(orders);
    return res.status(response.status.code).json(response);
  } catch (error) {
    next(error);
  }
};

const getAllOrderByTeacherId = async (req, res, next) => {
  try {
    let { status, dateFilter } = req.query;
    if (dateFilter) {
      let date = new Date().getDate() - dateFilter;
      dateFilter = new Date(new Date().setDate(date)).toISOString();
    }
    const user = req.user;
    let result;
    if (!status) {
      //status is not given returning all orders which has not been delivered and date filter is not given
      if (dateFilter) {
        result = await prisma.$queryRaw`SELECT 
      od.order_id as id,
      SUM(od.order_id)/od.order_id AS packs,
      od.delivery_address,
      o.first_name,
      o.last_name,
      o.gross_amount,
      o.shipping_cost,
      o.tax_amount,
      o.net_amount,
      o.placed,
      o.transit,
      o.dispatched,
      o.delivered,
      od.city,
      od.postal_code,
      o.createdAt,
      o.status
  FROM 
      order_details AS od
  JOIN 
      orders AS o ON od.order_id = o.id
  WHERE 
      od.shipper_id = ${user.id}
      AND o.placed >= ${dateFilter}
      AND o.status != "delivered"
  GROUP BY 
      od.order_id, od.delivery_address, od.city, od.postal_code, o.createdAt 
  ORDER BY o.id DESC`;
      }
      //status is not given returning all orders which has not been delivered and date filter is given
      else {
        result = await prisma.$queryRaw`SELECT 
      o.id,
      SUM(od.order_id)/od.order_id AS packs,
      od.delivery_address,
      o.first_name,
      o.last_name,
      o.gross_amount,
      o.shipping_cost,
      o.tax_amount,
      o.net_amount,
      o.placed,
      o.transit,
      o.dispatched,
      o.delivered,
      od.city,
      od.postal_code,
      o.createdAt,
      o.status
  FROM 
      order_details AS od
  JOIN 
      orders AS o ON od.order_id = o.id
  WHERE 
      od.shipper_id = ${user.id}
      AND o.status != 'delivered'
  GROUP BY 
      od.order_id, od.delivery_address, od.city, od.postal_code, o.createdAt
      ORDER BY o.id DESC `;
      }
    }
    //status is given returning all orders on the basis of status not currently using this
    else if (status !== "delivered") {
      result = await prisma.$queryRaw`SELECT 
       od.order_id as id,
      SUM(od.order_id)/od.order_id AS packs,
      o.first_name,
      o.last_name,
      o.gross_amount,
      o.shipping_cost,
      o.tax_amount,
      o.net_amount,
      o.placed,
      o.transit,
      o.dispatched,
      o.delivered,
      od.delivery_address,
      od.city,
      od.postal_code,
      o.createdAt,
      o.status
  FROM 
      order_details AS od
  JOIN 
      orders AS o ON od.order_id = o.id
  WHERE 
      od.shipper_id = ${user.id}
      AND o.status = ${status}
  GROUP BY 
      od.order_id, od.delivery_address, od.city, od.postal_code, o.createdAt
  ORDER BY o.id DESC`;
    }
    //status is given returning all orders on the basis of status and date filter
    else {
      if (dateFilter) {
        result = await prisma.$queryRaw`SELECT 
       od.order_id as id,
      SUM(od.order_id)/od.order_id AS packs,
      o.first_name,
      o.last_name,
      o.gross_amount,
      o.shipping_cost,
      o.tax_amount,
      o.net_amount,
      o.placed,
      o.transit,
      o.dispatched,
      o.delivered,
      od.delivery_address,
      od.city,
      od.postal_code,
      o.createdAt,
      o.status
  FROM 
      order_details AS od
  JOIN 
      orders AS o ON od.order_id = o.id
  WHERE 
      od.shipper_id = ${user.id}
      AND o.status = ${status}
      AND o.placed >= ${dateFilter}
  GROUP BY 
      od.order_id, od.delivery_address, od.city, od.postal_code, o.createdAt; `;
      }
      //status is given returning all orders on the basis of status without date filter
      else {
        result = await prisma.$queryRaw`SELECT 
        od.order_id as id,
       SUM(od.order_id)/od.order_id AS packs,
       o.first_name,
      o.last_name,
      o.gross_amount,
      o.shipping_cost,
      o.tax_amount,
      o.net_amount,
       o.placed,
       o.transit,
       o.dispatched,
       o.delivered,
       od.delivery_address,
       od.city,
       od.postal_code,
       o.createdAt,
       o.status
   FROM 
       order_details AS od
   JOIN 
       orders AS o ON od.order_id = o.id
   WHERE 
       od.shipper_id = ${user.id}
       AND o.status = ${status}
   GROUP BY 
       od.order_id, od.delivery_address, od.city, od.postal_code, o.createdAt
    ORDER BY o.id DESC`;
      }
    }
    const orders = [];
    result.map((i) => {
      orders.push(order_dto(i));
    });
    const response = okResponse(orders);
    return res.status(response.status.code).json(response);
  } catch (error) {
    next(error);
  }
};

const updateOrder = async (req, res, next) => {
  try {
    const { orderId } = req.params;
    const statusObj = {
      placed: "dispatched",
      dispatched: "transit",
      transit: "delivered",
    };

    const order = await prisma.orders.findFirst({
      where: { id: Number(orderId) },
    });

    if (!order) {
      const response = badRequestResponse("Order not found");
      return res.status(response.status.code).json(response);
    }

    if (order?.status == "delivered") {
      const response = badRequestResponse("Order has been delivered");
      return res.status(response.status.code).json(response);
    }
    const obj = {};
    obj.status = statusObj[order?.status];
    obj[statusObj[order?.status]] = new Date().toISOString();

    const result = await prisma.orders.update({
      data: { ...obj },
      where: {
        id: Number(orderId),
      },
    });

    const response = updateSuccessResponse(result);
    return res.status(response.status.code).json(response);
  } catch (error) {
    next(error);
  }
};

module.exports = {
  getAllOrder,
  getOrderById,
  getAllOrderByUserId,
  getAllOrderByTeacherId,
  updateOrder,
};
