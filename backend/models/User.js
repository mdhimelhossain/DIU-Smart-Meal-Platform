const mongoose = require("mongoose");

const userSchema = new mongoose.Schema({
  name: String,
  email: String,
  password: String,
  role: { type: String, enum: ["student", "owner"], default: "student" },
  profilePic: String,
  restaurantName: String,
  restaurantInfo: String,
  enrolledPackages: [
    {
      restaurantId: { type: mongoose.Schema.Types.ObjectId, ref: "User" },
      restaurantName: String,
      enrolledAt: Date,
      mealCount: Number,
      totalAmount: Number
    }
  ],
  foodHistory: [
    {
      foodId: { type: mongoose.Schema.Types.ObjectId, ref: "Food" },
      name: String,
      price: Number,
      image: String,
      restaurantId: { type: mongoose.Schema.Types.ObjectId, ref: "User" },
      restaurantName: String,
      date: Date,
      quantity: { type: Number, default: 1 }
    }
  ]
});

module.exports = mongoose.model("User", userSchema);
