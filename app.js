if(!process.env.NODE_ENV!=="production"){
    require("dotenv").config();
}

console.log(process.env.secret);
const express = require("express");
const app = express();
const mongoose = require("mongoose");
const FoodListing = require("./models/listing");
const path = require("path");
const methodOverride = require("method-override");
const ejsMate = require("ejs-mate");
const ExpressError = require("./utils/ExpressError");
const passport=require("passport");
const LocalStrategy = require("passport-local");
const User=require("./models/User");
const orderRouter = require("./routes/order");
const session=require("express-session");
const flash=require("connect-flash");
const listingRouter = require("./routes/listing");
const reviewRouter=require("./routes/reviews");
const  userRouter=require("./routes/users");

app.set("view engine", "ejs");
app.set("views", path.join(__dirname, "views"));
app.use(methodOverride("_method"));
app.use(express.urlencoded({ extended: true }));
app.engine("ejs", ejsMate);
app.use(express.static(path.join(__dirname, "/public")));
app.use("/uploads", express.static("uploads"));

const MONGO_URL = "mongodb://127.0.0.1:27017/Zaika_Zunction";
async function main() {
    await mongoose.connect(MONGO_URL);
}
main();

const sessionOptions={
    secret:"mySuperSecretCode",
    resave:false,
    saveUninitialized:true,
}

// Root Route
app.get("/", (req, res) => {
    res.send("Hi I am Root");

});


app.use(session(sessionOptions));
app.use(flash());

app.use(passport.initialize());
app.use(passport.session());
passport.use(new LocalStrategy(User.authenticate()));
passport.serializeUser(User.serializeUser());
passport.deserializeUser(User.deserializeUser());



app.use((req,res,next)=>{
    res.locals.success=req.flash("success");
    res.locals.error=req.flash("error");
    res.locals.currUser=req.user;
    next();
})


app.get("/demouser",async(req,res)=>{
    let fakeUser=new User({
        email:"sarthakshishodia@gmail.com",
        username:"sarthakshishodia",
        type:"owner",
    })
    let registeredUser=await User.register(fakeUser,"HelloWorld");
    console.log(registeredUser);
    res.send(registeredUser);
})
// Use listing routes
app.use("/listings", listingRouter);
app.use("/listings/:id/reviews",reviewRouter);
app.use("/",userRouter);
app.use("/orders", orderRouter);

// Test Listing Route
app.get("/testListing", async (req, res) => {
    try {
        let sampleFood = new FoodListing({
            name: "Margherita Pizza",
            price: 100,
            ingredients: "Onion,Tomato,Special",
            images: "https://images.unsplash.com/photo-1600850056064-a8b380df8395?w=600&auto=format&fit=crop&q=60&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxzZWFyY2h8Mnx8VmVnZXRhYmxlJTIwJTIwcm9sbHxlbnwwfHwwfHx8MA%3D%3D",
            location: "New Delhi",
            DeliveryCharge: 80,
        });
        await sampleFood.save();
        console.log("Food Saved");
        res.send("Testing Successfully");
    } catch (err) {
        console.log("Error saving food:", err);
        res.status(500).send("Error saving food");
    }
});

// Catch-all error handler
app.all("*", (req, res, next) => {
    next(new ExpressError(404, "Page Not Found"));
});

// Error handler middleware
app.use((err, req, res, next) => {
    const { statusCode = 500, message = "Something went wrong" } = err;
    res.status(statusCode).render("listings/error.ejs", { err });
});

// Start the server
app.listen(3010, () => {
    console.log("Server is running on port 3000");
});
