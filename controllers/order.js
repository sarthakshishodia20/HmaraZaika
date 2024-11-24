// const express = require("express");
// const router = express.Router();
const Order = require("../models/orders");
const FoodListing = require("../models/listing");
// const User = require("../models/User");

module.exports.orderFood=async (req, res) => {
    if (!req.isAuthenticated() || req.user.type !== "customer") {
        req.flash("error", "Unauthorised access nahi milta yahan");
        return res.redirect("/listings");
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
}

module.exports.myOrders=async (req, res) => {
    if (!req.isAuthenticated()) {
        req.flash("error", "Please log in to view your orders.");
        return res.redirect("/login");
    }
    
    const orders = await Order.find({ user: req.user._id }).populate("items.food");
    res.render("orders/myOrders", { orders });
}

module.exports.getOrderDetails=async (req, res) => {
    const order = await Order.findById(req.params.orderId).populate("items.food");
    res.render("orders/orderDetails", { order });
}


module.exports.deleteOrder = async (req, res) => {
    if (!req.isAuthenticated()) {
        req.flash("error", "Please log in to delete an order.");
        return res.redirect("/login");
    }

    const { orderId } = req.params;

    try {
        const order = await Order.findById(orderId);

        if (!order) {
            req.flash("error", "Order not found.");
            return res.redirect("/orders/myOrders");
        }

        if (order.user.toString() !== req.user._id.toString()) {
            req.flash("error", "You can only delete your own orders.");
            return res.redirect("/orders/myOrders");
        }

        await Order.findByIdAndDelete(orderId);

        req.flash("success", "Order deleted successfully!");
        res.redirect("/orders/myOrders");
    } catch (err) {
        console.error("Error deleting order:", err);
        req.flash("error", "Something went wrong while deleting the order.");
        res.redirect("/orders/myOrders");
    }
}