const express = require("express");
const router = express.Router();
const Order = require("../models/orders");
const FoodListing = require("../models/listing");
const User = require("../models/User");


router.post("/:foodId/order", async (req, res) => {
    if (!req.isAuthenticated() || req.user.type !== "customer") {
        req.flash("error", "You are not a customer.");
        return res.redirect("/");
    }
    
    const { foodId } = req.params;
    const foodItem = await FoodListing.findById(foodId);
    const order = new Order({
        user: req.user._id,
        items: [{
            food: foodItem._id,
            quantity: 1,
            totalPrice: foodItem.price
        }],
    });
    
    await order.save();
    req.flash("success", "Order placed successfully!");
    res.redirect(`/orders/${order._id}`);
});

router.get("/myOrders", async (req, res) => {
    if (!req.isAuthenticated()) {
        req.flash("error", "Please log in to view your orders.");
        return res.redirect("/login");
    }
    
    const orders = await Order.find({ user: req.user._id }).populate("items.food");
    res.render("orders/myOrders", { orders });
});

// View details of a specific order
router.get("/:orderId", async (req, res) => {
    const order = await Order.findById(req.params.orderId).populate("items.food");
    res.render("orders/orderDetails", { order });
});

module.exports = router;