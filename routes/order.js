const express = require("express");
const router = express.Router();
const orderController=require("../controllers/order");


router.post("/:foodId/order",orderController.orderFood);

router.get("/myOrders",orderController.myOrders);

router.get("/:orderId",orderController.getOrderDetails);

module.exports = router;