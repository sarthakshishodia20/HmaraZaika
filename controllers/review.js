const Review=require("../models/Review.js");
const FoodListing=require("../models/listing");

module.exports.createReview=async (req, res) => {
    let listing = await FoodListing.findById(req.params.id);
    let newReview = new Review(req.body.review);
    newReview.author=req.user._id;
    listing.reviews.push(newReview);
    await newReview.save();
    await listing.save();
    req.flash("success", "New Review Created");
    res.redirect(`/listings/${listing._id}`);
}

module.exports.deleteReview=async (req, res) => {
    const { id, reviewId } = req.params;
    await FoodListing.findByIdAndUpdate(id, { $pull: { reviews: reviewId } });
    await Review.findByIdAndDelete(reviewId);
    req.flash("success", "Review Deleted");
    res.redirect(`/listings/${id}`);
};