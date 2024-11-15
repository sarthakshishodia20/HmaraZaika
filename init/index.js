// jo hmara sample data hai use baari baari add na krke ek saath add kia hai database mein bss vhi method hai chor do abhi ke liye chahe toh vese bhi ksii kaam nhi aane wala ye 

const mongoose=require("mongoose");
const initData=require("./data");
const FoodListing=require("../models/listing");


const MONGO_URL = "mongodb://127.0.0.1:27017/Zaika_Zunction";
main().then(()=>{
    console.log("Connected to Database");
})
.catch((err)=>{ 
    console.log(err);
})


async function main(){
    await mongoose.connect(MONGO_URL);
}

const initDB=async()=>{

    await FoodListing.deleteMany({});
    initData.data=initData.data.map((obj)=>({...obj,owner:"6734a7a366add91bdefef624"}));
    await FoodListing.insertMany(initData.data);
    console.log("Data was initialised");
}
initDB();