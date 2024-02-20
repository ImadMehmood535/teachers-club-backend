/** @format */

const { prisma } = require("@/configs/prisma");
const {
  createSuccessResponse,
  updateSuccessResponse,
  deleteSuccessResponse,
  okResponse,
} = require("@/constants/responses");

const getAllCommunity = async (req, res, next) => {
  try {
    const result = await prisma.community.findMany();
    const response = okResponse(result);
    return res.status(response.status.code).json(response);
  } catch (error) {
    next(error);
  }
};

const createCommunity = async (req, res, next) => {
  try {
    const result = await prisma.community.create({
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

const updateCommunity = async (req, res, next) => {
  const { communityId } = req.params;
  try {
    const result = await prisma.community.update({
      where: {
        id: Number(communityId),
      },
      data: {
        ...req.body,
      },
    });
    const response = updateSuccessResponse(result);
    return res.status(response.status.code).json(response);
  } catch (error) {
    next(error);
  }
};

const deleteCommunity = async (req, res, next) => {
  const { communityId } = req.params;
  try {
    await prisma.community.delete({
      where: {
        id: Number(communityId),
      },
    });
    const response = deleteSuccessResponse();
    return res.status(response.status.code).json(response);
  } catch (error) {
    next(error);
  }
};

module.exports = {
  getAllCommunity,
  createCommunity,
  updateCommunity,
  deleteCommunity,
};
