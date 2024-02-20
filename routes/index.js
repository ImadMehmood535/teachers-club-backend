/** @format */

const { Router } = require("express");
const router = Router();

const handleMultipartData = require("../middleware/populateMultipartData.middleware");
const uploadImage = require("../middleware/uploadPicture.middleware");

const boxRouter = require("./boxes");
const boxTypeRouter = require("./box_types");
const adminRouter = require("./admin");
const userRouter = require("./user");
const brandRouter = require("./brands");
const orderRouter = require("./orders");
const contactRouter = require("./contact");
const communityRouter = require("./community");
const userBoxRouter = require("./user_box");
const shippingRouter = require("./shipping");
const subscriptionRouter = require("./subscription");
const featuredTeacherRouter = require("./featured_teachers");

router.post("/upload", handleMultipartData, uploadImage);
router.use("/box_type", boxTypeRouter);
router.use("/contact", contactRouter);
router.use("/box", boxRouter);
router.use("/admin", adminRouter);
router.use("/user", userRouter);
router.use("/brand", brandRouter);
router.use("/user_box", userBoxRouter);
router.use("/subscription", subscriptionRouter);
router.use("/order", orderRouter);
router.use("/community", communityRouter);
router.use("/shipping", shippingRouter);
router.use("/featured_teachers", featuredTeacherRouter);

module.exports = router;
