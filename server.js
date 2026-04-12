const path = require("path");
const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");
const bcrypt = require("bcryptjs");
require("dotenv").config({ path: path.join(__dirname, ".env") });

const Food = require("./models/Food");
const User = require("./models/User");
const app = express();
app.use(
  cors({
    origin: process.env.FRONTEND_URL || "http://localhost:3000",
    methods: ["GET", "POST", "PUT", "PATCH", "DELETE", "OPTIONS"],
    credentials: true
  })
);
app.options("*", cors());
app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ limit: '10mb', extended: true }));

app.get("/", (req, res) => res.send("API is running"));

app.use("/api/auth", require("./routes/authRoutes"));
app.use("/api/user", require("./routes/userRoutes"));
app.use("/api/food", require("./routes/foodRoutes"));
app.use("/api/mealplan", require("./routes/mealPlanRoutes"));

const seedFoodData = async () => {
  let owner = await User.findOne({ role: "owner" });
  if (!owner) {
    const hashed = await bcrypt.hash("owner123", 10);
    owner = await User.create({
      name: "DIU Cafe",
      email: "owner@diu.com",
      password: hashed,
      role: "owner",
      restaurantName: "DIU Cafe",
      restaurantInfo: "Campus restaurant for daily meals around DIU."
    });
  }

  const count = await Food.countDocuments();
  if (count === 0) {
    const sampleFoods = [
      {
        name: "Chicken Biryani",
        price: 180,
        image: "https://images.pexels.com/photos/263482/pexels-photo-263482.jpeg",
        status: "available",
        description: "Aromatic chicken biryani with flavorful spices.",
        category: "Lunch",
        restaurantName: owner.restaurantName,
        owner: owner._id
      },
      {
        name: "Beef Burger",
        price: 120,
        image: "https://images.pexels.com/photos/209540/pexels-photo-209540.jpeg",
        status: "available",
        description: "Juicy beef burger with fresh lettuce and cheese.",
        category: "Dinner",
        restaurantName: owner.restaurantName,
        owner: owner._id
      },
      {
        name: "Veggie Pizza",
        price: 220,
        image: "https://images.pexels.com/photos/315755/pexels-photo-315755.jpeg",
        status: "available",
        description: "Crispy pizza topped with fresh vegetables.",
        category: "Breakfast",
        restaurantName: owner.restaurantName,
        owner: owner._id
      }
    ];

    await Food.insertMany(sampleFoods);
    console.log("Seeded sample food items.");
  }
};

const mongoUri = process.env.MONGO_URI || "mongodb://127.0.0.1:27017/diu_food";

mongoose
  .connect(mongoUri)
  .then(async () => {
    console.log("DB Connected");
    await seedFoodData();
  })
  .catch(err => console.log("DB connection error:", err));

app.listen(5000, () => console.log("Server running on 5000"));
