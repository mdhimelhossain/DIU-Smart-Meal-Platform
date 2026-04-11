const Food = require("../models/Food");
const User = require("../models/User");

exports.getFoods = async (req, res) => {
  const foods = await Food.find().populate("owner", "name restaurantName role");

  const invalidFoods = foods.filter(
    (food) => !food.owner || food.owner.role !== "owner"
  );

  if (invalidFoods.length > 0) {
    await Promise.all(invalidFoods.map((food) => Food.findByIdAndDelete(food._id)));
  }

  const validFoods = foods.filter((food) => food.owner && food.owner.role === "owner");
  res.json(validFoods);
};

exports.addFood = async (req, res) => {
  const owner = req.user;
  if (!owner || owner.role !== "owner") {
    return res.status(403).json("Only restaurant owners can add food items");
  }

  const { name, price, image, description, status, category } = req.body;
  const food = await Food.create({
    name,
    price,
    image,
    description,
    status,
    category,
    restaurantName: owner.restaurantName || owner.name,
    owner: owner._id
  });

  res.json(food);
};

exports.getFoodsByOwner = async (req, res) => {
  const owner = await User.findById(req.params.ownerId).select("-password");
  if (!owner || owner.role !== "owner") {
    return res.status(404).json("Restaurant not found");
  }

  const foods = await Food.find({ owner: owner._id });
  res.json({ owner, foods });
};

exports.updateFood = async (req, res) => {
  const food = await Food.findById(req.params.foodId);
  if (!food) return res.status(404).json("Food not found");
  if (food.owner.toString() !== req.user._id.toString()) {
    return res.status(403).json("Not authorized to update this food item");
  }

  Object.assign(food, req.body);
  await food.save();
  res.json(food);
};

exports.deleteFood = async (req, res) => {
  const food = await Food.findById(req.params.foodId);
  if (!food) return res.status(404).json("Food not found");
  if (food.owner.toString() !== req.user._id.toString()) {
    return res.status(403).json("Not authorized to delete this food item");
  }

  await food.remove();
  res.json({ message: "Food removed" });
};
