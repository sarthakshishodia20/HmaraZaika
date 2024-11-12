const express = require("express");
const router = express.Router();
const wrapAsync = require("../utils/wrapAsync");
const FoodListing = require("../models/listing");
const ExpressError = require("../utils/ExpressError");
const { FoodListingSchema } = require("../Schema");
const {isLoggedIn}=require("../middleware");

const validateListings = (req, res, next) => {
    let { error } = FoodListingSchema.validate(req.body);
    if (error) {
        let errMsg = error.details.map((el) => el.message).join(",");
        throw new ExpressError(400, errMsg);
    } else {
        next();
    }
};

// Display all listings
router.get("/contact",(req,res)=>{
    res.render("listings/contact", { title: 'Contact Us' });
})

// //contact Page
// app.get('/contact', (req, res) => {
//     res.render('listings/contact',); 
//   });
// router.get("/help",(req,res)=>{
//     res.render("listings/help",{title:'help'});
// })

//help Page
router.get('/help', (req, res) => {
    res.render('listings/help', { title: 'Help' }); 
  });

//help Page
router.get('/FAQS', (req, res) => {
    res.render('listings/FAQS', { title: 'FAQS' }); 
  });


router.get("/about",(req,res)=>{
    res.render("listings/about",{title:'about'});
})

//help Page
router.get('/legal', (req, res) => {
    res.render('listings/legal', { title: 'Legal' }); 
  });

router.get("/offers",(req,res)=>{
    res.render('listings/offers');
})

router.get("/", wrapAsync(async (req, res) => {
    const allFoodListing = await FoodListing.find();
    res.render("listings/index", { allFoodListing });
}));

// Render form to create a new food item
router.get("/new",isLoggedIn, (req, res) => {
    res.render("listings/new");
});

// Create a new food item
router.post("/", validateListings, wrapAsync(async (req, res) => {
    let newFoodListing = new FoodListing(req.body.foodListing);
    if (!req.body.foodListing) {
        throw new ExpressError(400, "Send Valid Data");
    }
    await newFoodListing.save();
    req.flash("success", "New Item Created");
    res.redirect("/listings");
}));

// Show a specific food listing
router.get("/:id", wrapAsync(async (req, res) => {
    const { id } = req.params;
    const currentFoodListing = await FoodListing.findById(id).populate("reviews");
    if (!currentFoodListing) {
        req.flash("error", "This Item Does Not Exist In Our Database");
        return res.redirect("/listings"); // Redirect to listings if not found
    }
    res.render("listings/show", { currentFoodListing });
}));

// Render form to edit an existing food item
router.get("/:id/edit", isLoggedIn,wrapAsync(async (req, res) => {
    const { id } = req.params;
    const foodListing = await FoodListing.findById(id);
    if (!foodListing) {
        req.flash("error", "This Item Does Not Exist In Our Database");
        return res.redirect("/listings"); // Redirect to listings if not found
    }
    res.render("listings/edit", { foodListing });
}));

// Update an existing food item
router.put("/:id", isLoggedIn,validateListings, wrapAsync(async (req, res) => {
    const { id } = req.params;
    const updatedListing = await FoodListing.findByIdAndUpdate(id, { ...req.body.foodListing }, { new: true });
    if (!updatedListing) {
        req.flash("error", "This Item Does Not Exist In Our Database");
        return res.redirect("/listings"); // Redirect to listings if not found
    }
    req.flash("success", "Item Updated");
    res.redirect(`/listings/${id}`);
}));

// Delete a food item
router.delete("/:id",isLoggedIn, wrapAsync(async (req, res) => {
    const { id } = req.params;
    const deletedListing = await FoodListing.findByIdAndDelete(id);
    if (!deletedListing) {
        req.flash("error", "This Item Does Not Exist In Our Database");
        return res.redirect("/listings");
    }
    req.flash("success", "Item Deleted");
    res.redirect("/listings");
}));

module.exports = router;
