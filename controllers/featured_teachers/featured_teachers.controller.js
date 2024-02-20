/** @format */

const { prisma } = require("@/configs/prisma");
const {
  createSuccessResponse,
  updateSuccessResponse,
  okResponse,
  badRequestResponse,
} = require("@/constants/responses");

const getAllFaturedTeachers = async (req, res, next) => {
  try {
    const result = await prisma.users.findMany({
      include: {
        user_details: true,
      },
      where: {
        type: "teacher",
        user_details: {
          is_featured: true,
        },
      },
    });
    const response = okResponse(result);
    return res.status(response.status.code).json(response);
  } catch (error) {
    next(error);
  }
};

const createFaturedTeachers = async (req, res, next) => {
  try {
    const { teacher_id } = req.body;
    const teacher = await prisma.users.findFirst({
      where: { id: Number(teacher_id) },
    });

    if (!teacher || teacher?.type !== "teacher") {
      const response = badRequestResponse("Invalid teacher.");
      return res.status(response.status.code).json(response);
    }
    const result = await prisma.featured_teachers.create({
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

const updateFaturedTeachers = async (req, res, next) => {
  const { featuredId } = req.params;
  try {
    const { teacher_id } = req.body;
    const teacher = await prisma.users.findFirst({
      where: { id: Number(teacher_id) },
    });

    if (!teacher || teacher?.type !== "teacher") {
      const response = badRequestResponse("Invalid teacher.");
      return res.status(response.status.code).json(response);
    }
    const result = await prisma.featured_teachers.update({
      where: {
        id: Number(featuredId),
      },
      data: {
        teacher_id,
      },
    });
    const response = updateSuccessResponse(result);
    return res.status(response.status.code).json(response);
  } catch (error) {
    next(error);
  }
};

const deleteFaturedTeachers = async (req, res, next) => {
  const { featuredId } = req.params;
  try {
    const teacher = await prisma.users.findFirst({
      where: { id: Number(featuredId) },
    });

    if (!teacher || teacher?.type !== "teacher") {
      const response = badRequestResponse("Invalid teacher.");
      return res.status(response.status.code).json(response);
    }
    const result = await prisma.featured_teachers.delete({
      where: {
        teacher_id: Number(featuredId),
      },
    });
    const response = updateSuccessResponse(result);
    return res.status(response.status.code).json(response);
  } catch (error) {
    next(error);
  }
};

module.exports = {
  deleteFaturedTeachers,
  getAllFaturedTeachers,
  updateFaturedTeachers,
  createFaturedTeachers,
};
