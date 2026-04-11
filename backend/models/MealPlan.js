const mongoose = require("mongoose");

const mealPlanSchema = new mongoose.Schema({
  user: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
  month: { type: String, required: true }, // e.g., "2026-04"
  selections: [{
    date: { type: Date, required: true },
    food: { type: mongoose.Schema.Types.ObjectId, ref: "Food", required: true },
    restaurant: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
    quantity: { type: Number, default: 1 }
  }],
  enrolledAt: { type: Date, default: Date.now },
  status: { type: String, enum: ["active", "completed"], default: "active" }
});

module.exports = mongoose.model("MealPlan", mealPlanSchema);