const foodListing=require("./models/listing");
const Review=require("./models/Review");
const ExpressError = require("./utils/ExpressError");
const { FoodListingSchema,reviewSchema } = require("./Schema");

module.exports.isLoggedIn = (req, res, next) => {
    if (!req.isAuthenticated()) {
        req.session.redirectUrl=req.originalUrl;
        req.flash("error", "You must be logged in!");
        return res.redirect("/login");
    }
    next(); 
};


module.exports.saveRedirectUrl=(req,res,next)=>{
    if(req.session.redirectUrl){
        res.locals.redirectUrl=req.session.redirectUrl;
    }
    next();
}


module.exports.isOwner=async (req,res,next)=>{
    let {id}=req.params;
    let foodlisting=await foodListing.findById(id);
    if(!foodlisting.owner.equals(res.locals.currUser._id)){
        req.flash("error","You are not serving this Food Item. Apna Bnao na!");
        return res.redirect(`/listings/${id}`);
    }
    next();
}

module.exports.validateListings = (req, res, next) => {
    let { error } = FoodListingSchema.validate(req.body);
    if (error) {
        let errMsg = error.details.map((el) => el.message).join(",");
        throw new ExpressError(400, errMsg);
    } else {
        next();
    }
};

module.exports.validateReviews = (req, res, next) => {
    let { error } = reviewSchema.validate(req.body);
    if (error) {
        let errMsg = error.details.map((el) => el.message).join(",");
        throw new ExpressError(404, errMsg);
    } else {
        next();
    }
};

module.exports.isReviewAuthor=async(req,res,next)=>{
    let{id,reviewId}=req.params;
    let review=await Review.findById(reviewId);
    if(!review.author.equals(res.locals.currUser._id)){
        req.flash("error","Apna Review Delete kro na ");
        return res.redirect(`/listings/${id}`);

    }
    next();
}