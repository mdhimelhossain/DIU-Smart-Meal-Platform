const MealPlan = require("../models/MealPlan");
const User = require("../models/User");
const Food = require("../models/Food");

// Enroll in monthly meal plan
exports.enroll = async (req, res) => {
  const { restaurantId } = req.body;
  const userId = req.user.id;

  if (!restaurantId) {
    return res.status(400).json("Restaurant ID is required");
  }

  // Check if already enrolled for current month
  const currentMonth = new Date().toISOString().slice(0, 7); // YYYY-MM
  const existing = await MealPlan.findOne({ user: userId, month: currentMonth });
  if (existing) {
    return res.status(400).json("Already enrolled for this month");
  }

  const restaurant = await User.findById(restaurantId);
  if (!restaurant || restaurant.role !== "owner") {
    return res.status(400).json("Invalid restaurant");
  }

  const mealPlan = await MealPlan.create({
    user: userId,
    restaurant: restaurantId,
    month: currentMonth
  });

  res.json({ message: "Enrolled successfully", mealPlan });
};

// Get current meal plan
exports.getCurrentPlan = async (req, res) => {
  const userId = req.user.id;
  const currentMonth = new Date().toISOString().slice(0, 7);

  const plan = await MealPlan.findOne({ user: userId, month: currentMonth })
    .populate("selections.food")
    .populate("selections.restaurant", "name restaurantName");

  if (plan) {
    // Check if month is over
    const now = new Date();
    const lastDayOfMonth = new Date(now.getFullYear(), now.getMonth() + 1, 0);
    if (now > lastDayOfMonth && plan.status === "active") {
      plan.status = "completed";
      await plan.save();
    }
  }

  if (!plan) {
    return res.status(404).json("No active meal plan for this month");
  }

  res.json(plan);
};

// Add or update meal selection
exports.selectMeal = async (req, res) => {
  const { date, foodId, restaurantId, quantity = 1 } = req.body;
  const userId = req.user.id;
  const currentMonth = new Date().toISOString().slice(0, 7);

  // Check if enrolled in the restaurant
  const user = await User.findById(userId);
  const isEnrolled = user.enrolledPackages.some(p => p.restaurantId.toString() === restaurantId);
  if (!isEnrolled) {
    return res.status(400).json("Not enrolled in this restaurant");
  }

  let plan = await MealPlan.findOne({ user: userId, month: currentMonth });
  if (!plan) {
    // Create plan if not exists
    plan = await MealPlan.create({ user: userId, month: currentMonth });
  }

  if (plan.status !== "active") {
    return res.status(400).json("Meal plan is not active");
  }

  const food = await Food.findById(foodId);
  if (!food || food.owner.toString() !== restaurantId) {
    return res.status(400).json("Invalid food selection");
  }

  // Check if selection for this date, food, restaurant exists
  const existingIndex = plan.selections.findIndex(s => 
    s.date.toISOString().slice(0, 10) === date && 
    s.food.toString() === foodId && 
    s.restaurant.toString() === restaurantId
  );

  if (existingIndex >= 0) {
    // Update quantity
    plan.selections[existingIndex].quantity += quantity;
  } else {
    // Add new
    plan.selections.push({ date: new Date(date), food: foodId, restaurant: restaurantId, quantity });
  }

  await plan.save();

  // Add to user food history so meal selection shows in Food History tab
  const restaurant = await User.findById(restaurantId);
  const userToUpdate = await User.findById(userId);
  if (userToUpdate) {
    userToUpdate.foodHistory = userToUpdate.foodHistory || [];
    userToUpdate.foodHistory.push({
      foodId: food._id,
      name: food.name,
      price: food.price,
      image: food.image || "",
      restaurantId,
      restaurantName: restaurant?.restaurantName || restaurant?.name || "",
      date: new Date(date),
      quantity
    });
    await userToUpdate.save();
  }

  const updatedPlan = await MealPlan.findById(plan._id).populate("selections.food").populate("selections.restaurant", "name restaurantName");

  res.json({ message: "Meal selected", plan: updatedPlan });
};

// Unenroll from a restaurant, remove related meal selections, and clear food history
exports.unenroll = async (req, res) => {
  const { restaurantId } = req.body;
  const userId = req.user.id;
  const currentMonth = new Date().toISOString().slice(0, 7);

  const user = await User.findById(userId);
  user.enrolledPackages = (user.enrolledPackages || []).filter(
    p => p.restaurantId.toString() !== restaurantId
  );
  user.foodHistory = (user.foodHistory || []).filter(
    item => item.restaurantId?.toString() !== restaurantId
  );
  await user.save();

  // Remove selections for this restaurant
  const plan = await MealPlan.findOne({ user: userId, month: currentMonth });
  if (plan) {
    plan.selections = plan.selections.filter(s => s.restaurant.toString() !== restaurantId);
    await plan.save();
  }

  res.json({ message: "Unenrolled, selections removed, and food history cleared" });
};

// Remove meal selection
exports.removeMeal = async (req, res) => {
  const { date, foodId, restaurantId } = req.body;
  const userId = req.user.id;
  const currentMonth = new Date().toISOString().slice(0, 7);

  const plan = await MealPlan.findOne({ user: userId, month: currentMonth });
  if (!plan) {
    return res.status(400).json("No meal plan");
  }

  plan.selections = plan.selections.filter(s => 
    !(s.date.toISOString().slice(0, 10) === date && s.food.toString() === foodId && s.restaurant.toString() === restaurantId)
  );

  await plan.save();
  res.json({ message: "Meal removed" });
};

// Get monthly summary
exports.getSummary = async (req, res) => {
  const userId = req.user.id;
  const { month } = req.query;
  const targetMonth = month || new Date().toISOString().slice(0, 7);

  const plan = await MealPlan.findOne({ user: userId, month: targetMonth })
    .populate("selections.food")
    .populate("selections.restaurant", "name restaurantName");

  if (!plan) {
    return res.status(404).json("No meal plan found");
  }

  const totalMeals = plan.selections.reduce((sum, s) => sum + s.quantity, 0);
  const totalAmount = plan.selections.reduce((sum, s) => sum + (s.food?.price || 0) * s.quantity, 0);
  const items = plan.selections.map(s => ({
    date: s.date,
    food: s.food?.name,
    quantity: s.quantity,
    price: s.food?.price,
    restaurant: s.restaurant?.restaurantName || s.restaurant?.name
  }));

  res.json({
    totalMeals,
    totalAmount,
    items
  });
};;

// Check if month is over and close plan
exports.checkAndClosePlan = async (req, res) => {
  const userId = req.user.id;
  const currentMonth = new Date().toISOString().slice(0, 7);
  const now = new Date();
  const lastDayOfMonth = new Date(now.getFullYear(), now.getMonth() + 1, 0);

  if (now > lastDayOfMonth) {
    await MealPlan.findOneAndUpdate(
      { user: userId, month: currentMonth, status: "active" },
      { status: "completed" }
    );
  }

  res.json({ message: "Checked" });
};