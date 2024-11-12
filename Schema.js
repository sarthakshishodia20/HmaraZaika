const Joi = require("joi");

module.exports.FoodListingSchema = Joi.object({
    foodListing: Joi.object({
        name: Joi.string().required(),
        price: Joi.number().required(),
        ingredients: Joi.string().required(),
        images: Joi.string().required(),
        location: Joi.string().required(),
        DeliveryCharge: Joi.number().optional() 
    }).required()
});


module.exports.reviewSchema = Joi.object({
    review: Joi.object({
        rating: Joi.number().required().min(1).max(5),
        comment: Joi.string().required(),
    }).required()
});
