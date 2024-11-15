const express = require("express");
const User = require("../models/User");  // Import the User model
const passport = require("passport");
const router = express.Router();
const mongoose = require("mongoose");
const Schema = mongoose.Schema;
const passportLocalMongoose = require("passport-local-mongoose");
const {saveRedirectUrl}=require("../middleware");

module.exports.renderSignup=(req, res) => {
    res.render("users/signup"); 
};

module.exports.actualsignup= async (req, res) => {
    try { 
        let { username, email, password, type } = req.body;
        const newUser = new User({ username, email, type });
        const registeredUser = await User.register(newUser, password);  // User.register hashes the password and saves it
        console.log(registeredUser);
        req.login(registeredUser, (err) => {
            if (err) {
                next(err);
            }
            req.flash("success", "Welcome to Zaika Zunction! You are signed in.");
            res.redirect("/listings");  // Redirect to listings after signup and login
        })
    } catch (e) {
        req.flash("error", e.message);  // Flash any errors during registration
        res.redirect("/signup");
    }
};

module.exports.renderLogin= (req, res) => {
    res.render("users/login.ejs");  // Render the login page
};

module.exports.postLogin= async (req, res, next) => {
    try {
        req.flash("success", "Welcome to Zaika Junction");
        res.redirect("/listings"); 
    } catch (err) {
        return next(err);
    }
};

module.exports.logout=(req,res,next)=>{
    req.logout((err)=>{
        if(err){
            return next(err);
        }
        req.flash("success","You are logged Out");
        res.redirect("/listings");
    });
};