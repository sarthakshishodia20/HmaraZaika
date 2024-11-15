const express = require("express");
const User = require("../models/User");  // Import the User model
const passport = require("passport");
const router = express.Router();
const mongoose = require("mongoose");
const Schema = mongoose.Schema;
const passportLocalMongoose = require("passport-local-mongoose");
const {saveRedirectUrl}=require("../middleware");
const userController=require("../controllers/user");
// Signup route
router.get("/signup", userController.renderSignup);

// POST Signup route with automatic login after signup

router.post("/signup",userController.actualsignup);


// GET login route
router.get("/login",userController.renderLogin);

// POST login route with Passport authentication
router.post("/login", saveRedirectUrl,passport.authenticate("local", {
    failureRedirect: "/login",
    failureFlash: true ,
}),userController.postLogin);

router.get("/logout",userController.logout);

module.exports = router;