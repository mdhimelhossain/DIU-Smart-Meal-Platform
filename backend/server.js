const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");

const app = express();
app.use(cors());
app.use(express.json());

mongoose.connect("mongodb://127.0.0.1:27017/diu_meal_db")
.then(()=>console.log("MongoDB Connected"))
.catch(err=>console.log(err));

// ================= MODELS =================

const User = mongoose.model("User",{
  name:String,
  email:String,
  password:String,
  role:String
});

const Restaurant = mongoose.model("Restaurant",{
  name:String,
  ownerId:String
});

const Meal = mongoose.model("Meal",{
  restaurantId:String,
  name:String,
  price:Number
});

// ================= AUTH =================

app.post("/auth/register", async(req,res)=>{
  const user = await User.create(req.body);
  res.json({message:"Registered Successfully"});
});

app.post("/auth/login", async(req,res)=>{
  const user = await User.findOne({
    email:req.body.email,
    password:req.body.password
  });

  if(user){
    res.json({user});
  }else{
    res.json({message:"Invalid Credentials"});
  }
});

// ================= RESTAURANT =================

app.get("/restaurants", async(req,res)=>{
  const data = await Restaurant.find();
  res.json(data);
});

app.post("/restaurants", async(req,res)=>{
  await Restaurant.create(req.body);
  res.json({message:"Restaurant Added"});
});

// ================= MEALS =================

app.get("/meals/:id", async(req,res)=>{
  const data = await Meal.find({restaurantId:req.params.id});
  res.json(data);
});

app.post("/meals", async(req,res)=>{
  await Meal.create(req.body);
  res.json({message:"Meal Added"});
});

app.listen(5000,()=>console.log("Server Started on 5000"));
