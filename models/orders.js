const mongoose = require("mongoose");
const orderSchema = new mongoose.Schema({
    user: { type: mongoose.Schema.Types.ObjectId, ref: "User" },
    items: [{
        food: { type: mongoose.Schema.Types.ObjectId, ref: "FoodListing" },
        quantity: Number,
        totalPrice: Number
    }],
    status: { type: String, default: "Pending" },
    deliveryStatus: { type: String, default: "Not Delivered" },
});

module.exports = mongoose.model("Order", orderSchema);