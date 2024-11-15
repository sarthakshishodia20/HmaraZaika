const FoodListing=require("../models/listing");
const mbxGeocoding = require('@mapbox/mapbox-sdk/services/geocoding');
const mapToken=process.env.MAP_TOKEN;
const geocodingClient=mbxGeocoding({accessToken:mapToken});


module.exports.index=async (req, res) => {
    const allFoodListing = await FoodListing.find();
    res.render("listings/index", { allFoodListing });
}

module.exports.renderNewForm=(req, res) => {
    res.render("listings/new");
}

module.exports.showFoodItem=async (req, res) => {
    const { id } = req.params;
    const currentFoodListing = await FoodListing.findById(id)
    .populate({
        path:"reviews",
        populate:{
        path:"author",
    },
})
.populate("owner");
    if (!currentFoodListing) {
        req.flash("error", "This Item Does Not Exist In Our Database");
        return res.redirect("/listings"); // Redirect to listings if not found
    }
    // console.log(currentFoodListing);
    res.render("listings/show", { currentFoodListing });
};


module.exports.renderEditForm=async (req, res) => {
    const { id } = req.params;
    const foodListing = await FoodListing.findById(id);
    if (!foodListing) {
        req.flash("error", "This Item Does Not Exist In Our Database");
        return res.redirect("/listings"); // Redirect to listings if not found
    }
    res.render("listings/edit", { foodListing });
};

module.exports.updateExistingFoodItem=async (req, res) => {
    const { id } = req.params;
    const updatedListing = await FoodListing.findByIdAndUpdate(id, { ...req.body.foodListing }, { new: true });
    if (!updatedListing) {
        req.flash("error", "This Item Does Not Exist In Our Database");
        return res.redirect("/listings"); // Redirect to listings if not found
    }
    if(typeof(req.file)!=="undefined"){
        let url=req.file.url;
    let filename=req.file.filename;
    updatedListing.images={url,filename};
    await updateListing.save();

    }
    
    req.flash("success", "Item Updated");
    res.redirect(`/listings/${id}`);
};

module.exports.deleteFoodItem= async (req, res) => {
    const { id } = req.params;
    const deletedListing = await FoodListing.findByIdAndDelete(id);
    if (!deletedListing) {
        req.flash("error", "This Item Does Not Exist In Our Database");
        return res.redirect("/listings");
    }
    req.flash("success", "Item Deleted");
    res.redirect("/listings");
}

module.exports.createNewFoodItem=async (req, res) => {
    let response=geocodingClient.forwardGeocode({
        query:req.body.foodListing.location,
        limit:1,
    })
    .send();
    console.log(response.body.features[0].geometry);

    let url=req.file.path;
    let filename=req.file.filename;
    console.log(url,"...",filename);
    let newFoodListing = new FoodListing(req.body.foodListing);
    if (!req.body.foodListing) {
        throw new ExpressError(400, "Send Valid Data");
    }
    
    newFoodListing.owner=req.user._id;
    newFoodListing.images={url,filename};
    newFoodListing.geometry=response.body.features[0].geometry;
    let savedListing=await newFoodListing.save();
    console.log(savedListing);
    req.flash("success", "New Item Created");
    res.redirect("/listings");
};

module.exports.getOffers=(req,res)=>{
    res.render('listings/offers');
};

module.exports.getHelp=(req, res) => {
    res.render('listings/legal', { title: 'Legal' }); 
};

module.exports.getAbout=(req,res)=>{
    res.render("listings/about",{title:'about'});
};

module.exports.getFAQs= (req, res) => {
    res.render('listings/FAQS', { title: 'FAQS' }); 
};

module.exports.HelpPage= (req, res) => {
    res.render('listings/help', { title: 'Help' }); 
};

module.exports.getContact=(req,res)=>{
    res.render("listings/contact", { title: 'Contact Us' });
};