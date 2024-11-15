const express = require("express");
const router = express.Router({mergeParams:true});
const wrapAsync = require("../utils/wrapAsync");
const FoodListing = require("../models/listing");
const Review = require("../models/Review");
const { reviewSchema } = require("../Schema");
const {validateReviews,isLoggedIn,isReviewAuthor}=require("../middleware.js");

const reviewController=require("../controllers/review");


// Review Routes
router.post("/", isLoggedIn,validateReviews, wrapAsync(reviewController.createReview));

router.delete("/:reviewId",isLoggedIn,isReviewAuthor, wrapAsync(reviewController.deleteReview));

module.exports=router;