const mongoose = require("mongoose");

const foodSchema = new mongoose.Schema({
  name: String,
  price: Number,
  image: String,
  description: String,
  status: { type: String, default: "available" },
  category: String,
  restaurantName: String,
  owner: { type: mongoose.Schema.Types.ObjectId, ref: "User" }
});

module.exports = mongoose.model("Food", foodSchema);
