/** @format */

const { prisma } = require("@/configs/prisma");
const {
  createSuccessResponse,
  updateSuccessResponse,
  deleteSuccessResponse,
  okResponse,
  badRequestResponse,
} = require("@/constants/responses");
//dfsfdsfd
const getAllBoxTypes = async (req, res, next) => {
  try {
    const result = await prisma.box_types.findMany();
    const response = okResponse(result);
    return res.status(response.status.code).json(response);
  } catch (error) {
    next(error);
  }
};

const createBoxTypes = async (req, res, next) => {
  const { name } = req.body;
  try {
    const box_type = await prisma.box_types.findFirst({
      where: {
        name,
      },
    });
    if (box_type) {
      const response = badRequestResponse("Already created.");
      return res.status(response.status.code).json(response);
    }
    const result = await prisma.box_types.create({
      data: {
        name,
      },
    });
    const response = createSuccessResponse(result);
    return res.status(response.status.code).json(response);
  } catch (error) {
    next(error);
  }
};

const updateBoxTypes = async (req, res, next) => {
  const { id } = req.params;
  const { name } = req.body;
  try {
    const box_type = await prisma.box_types.findFirst({
      where: {
        name,
      },
    });
    if (box_type) {
      const response = badRequestResponse("Box Type already found.");
      return res.status(response.status.code).json(response);
    }
    const result = await prisma.box_types.update({
      where: {
        id: Number(id),
      },
      data: {
        name,
      },
    });
    const response = updateSuccessResponse(result);
    return res.status(response.status.code).json(response);
  } catch (error) {
    next(error);
  }
};

const deleteBoxTypes = async (req, res, next) => {
  const { tagId } = req.params;
  try {
    await prisma.tags.delete({
      where: {
        id: Number(tagId),
      },
    });

    const response = deleteSuccessResponse();
    return res.status(response.status.code).json(response);
  } catch (error) {
    next(error);
  }
};

module.exports = {
  getAllBoxTypes,
  createBoxTypes,
  updateBoxTypes,
  deleteBoxTypes,
};
