require("dotenv").config();
console.log(process.env.SECRET);

const express = require("express");
const router = express.Router();
const wrapAsync = require("../utils/wrapAsync");
const FoodListing = require("../models/listing");
const ExpressError = require("../utils/ExpressError");
const { FoodListingSchema } = require("../Schema");
const { isLoggedIn, isOwner, validateListings } = require("../middleware");
const multer = require("multer");
const {storage}=require("../cloudConfig.js");
const upload = multer({storage});
const listingController = require("../controllers/listing.js");



// Static pages
router.get("/contact", listingController.getContact);
router.get("/help", listingController.HelpPage);
router.get("/FAQS", listingController.getFAQs);
router.get("/about", listingController.getAbout);
router.get("/legal", listingController.getHelp);
router.get("/offers", listingController.getOffers);

// Main listings routes
router.route("/")
    .get(wrapAsync(listingController.index))            // Display all listings
    .post(
        isLoggedIn,
        upload.single('foodListing[image]'),
        validateListings,
        wrapAsync(listingController.createNewFoodItem));
// Upload image
// router.post("/", upload.single('listing[image][url]'), (req, res) => {
//     res.send(req.file);
// });

// Render form to create a new food item
router.get("/new", isLoggedIn, listingController.renderNewForm);

// Specific listing routes by ID
router.route("/:id")
    .get(wrapAsync(listingController.showFoodItem))           // Show a specific food listing
    .put(
        isLoggedIn, 
        isOwner, 
        upload.single('foodListing[image]'),
        validateListings,
        wrapAsync(listingController.updateExistingFoodItem))
    .delete(isLoggedIn, isOwner, wrapAsync(listingController.deleteFoodItem));

// Render form to edit a food item
router.get("/:id/edit", isLoggedIn, isOwner, wrapAsync(listingController.renderEditForm));

module.exports = router;
