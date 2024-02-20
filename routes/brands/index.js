/** @format */

const { Router } = require("express");
const {
  getAllBrands,
  createBrands,
  updateBrands,
  deleteBrands,
} = require("@/controllers/brands/brands.controller");

const validateRequest = require("@/middleware/validateRequestJoi.middleware");
const {
  createBrandsSchema,
  udpateBrandsSchema,
} = require("@/validation/brands");
const restrictToAdmins = require("../../middleware/restrictToAdmins");

const router = Router();

router.get("/", getAllBrands);
router.post("/", validateRequest(createBrandsSchema), createBrands);
router.patch("/:brandId", validateRequest(udpateBrandsSchema), updateBrands);
router.delete("/:brandId", restrictToAdmins, deleteBrands);

module.exports = router;
