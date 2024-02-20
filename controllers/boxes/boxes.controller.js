/** @format */

const { prisma } = require("@/configs/prisma");
const {
  createSuccessResponse,
  updateSuccessResponse,
  deleteSuccessResponse,
  okResponse,
} = require("@/constants/responses");
const box_dto = require("@/dto/box");

const getAllBoxes = async (req, res, next) => {
  try {
    const { page = 1, pageLimit = 12, web } = req.query;
    const skipAmount = (page - 1) * +pageLimit;

    const result = await prisma.boxes.findMany({
      include: {
        box_types: true,
      },
      skip: skipAmount,
      take: +pageLimit,
    });
    const brands = await prisma.brands.findMany();
    let boxes;

    if (web) {
      boxes = {};
      result.forEach((obj) => {
        const itemName = obj.box_types.name;
        if (obj.is_brand) {
          obj.brands = brands;
        }
        if (!boxes[itemName]) {
          boxes[itemName] = [];
        }

        boxes[itemName].push(box_dto(obj));
      });
    } else {
      boxes = [];
      result.map((box) => {
        if (box.is_brand) {
          box.brands = brands;
        }
        boxes.push(box_dto(box));
      });
    }

    const boxLength = await prisma.boxes.findMany();
    const pages = Math.ceil(boxLength.length / +pageLimit);

    let response = okResponse({ boxes, totalPage: pages });

    return res.status(response.status.code).json(response);
  } catch (error) {
    next(error);
  }
};

const getBoxById = async (req, res, next) => {
  try {
    const { boxId } = req.params;
    const brands = await prisma.brands.findMany();
    let result = await prisma.boxes.findFirst({
      where: { id: Number(boxId) },
      include: {
        box_types: true,
      },
    });
    result.brands = brands;
    result = box_dto(result);
    const similarBoxes = await prisma.boxes.findMany({
      include: {
        box_types: true,
      },
      where: {
        id: { not: Number(boxId) },
        type_id: result.type_id,
      },
      take: 8,
    });

    result.similar_boxes = similarBoxes.map((i) => {
      if (i.is_brand) {
        i.brands = brands;
      }
      return box_dto(i);
    });
    const response = okResponse(result);
    return res.status(response.status.code).json(response);
  } catch (error) {
    next(error);
  }
};

const createBox = async (req, res, next) => {
  try {
    console.log(req.body)
    const result = await prisma.boxes.create({
      data: {
        ...req.body,
      },
    });
    const response = createSuccessResponse(result);
    return res.status(response.status.code).json(response);
  } catch (error) {
    next(error);
  }
};

const updateBox = async (req, res, next) => {
  const { boxId } = req.params;
  console.log(req.body , "testing")
  try {
    const result = await prisma.boxes.update({
      data: {
        ...req.body,
      },
      where: { id: Number(boxId) },
    });

    const response = updateSuccessResponse(result);
    return res.status(response.status.code).json(response);
  } catch (error) {
    next(error);
  }
};

const deleteBox = async (req, res, next) => {
  const id = Number(req.params.boxId);

  try {
    await prisma.boxes.delete({
      where: {
        id,
      },
    });

    const response = deleteSuccessResponse();
    return res.status(response.status.code).json(response);
  } catch (error) {
    next(error);
  }
};

module.exports = {
  getAllBoxes,
  getBoxById,
  createBox,
  updateBox,
  deleteBox,
};
