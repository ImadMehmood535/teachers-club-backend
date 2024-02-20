/** @format */

const { prisma } = require("@/configs/prisma");
const {
  createSuccessResponse,
  updateSuccessResponse,
  deleteSuccessResponse,
  okResponse,
  badRequestResponse,
} = require("@/constants/responses");

const getAllBrands = async (req, res, next) => {
  try {
    const result = await prisma.brands.findMany();
    const response = okResponse(result);
    return res.status(response.status.code).json(response);
  } catch (error) {
    next(error);
  }
};
const createBrands = async (req, res, next) => {
  const { name } = req.body;
  try {
    const brand = await prisma.brands.findFirst({
      where: {
        name,
      },
    });
    if (brand) {
      const response = badRequestResponse("Already created.");
      return res.status(response.status.code).json(response);
    }
    const result = await prisma.brands.create({
      data: { name },
    });
    const response = createSuccessResponse(result);
    return res.status(response.status.code).json(response);
  } catch (error) {
    next(error);
  }
};

const updateBrands = async (req, res, next) => {
  const { brandId } = req.params;
  const { name } = req.body;
  try {
    const brand = await prisma.brands.findFirst({
      where: {
        name,
      },
    });
    if (brand) {
      const response = badRequestResponse("Brand already found.");
      return res.status(response.status.code).json(response);
    }
    const result = await prisma.brands.update({
      where: {
        id: Number(brandId),
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

const deleteBrands = async (req, res, next) => {
  const { brandId } = req.params;
  try {
    await prisma.sizes.delete({
      where: {
        id: Number(brandId),
      },
    });

    const response = deleteSuccessResponse();
    return res.status(response.status.code).json(response);
  } catch (error) {
    next(error);
  }
};

module.exports = {
  getAllBrands,
  createBrands,
  updateBrands,
  deleteBrands,
};
