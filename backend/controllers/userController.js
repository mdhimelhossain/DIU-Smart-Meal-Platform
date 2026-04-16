const User = require("../models/User");
const Food = require("../models/Food");

exports.getProfile = async (req, res) => {
  const user = req.user.toObject();

  if (user.role === "owner") {
    const menuCount = await Food.countDocuments({ owner: user._id });
    const subscribers = await User.countDocuments({ "enrolledPackages.restaurantId": user._id });
    user.menuCount = menuCount;
    user.subscribers = subscribers;
  }

  res.json(user);
};

exports.updateProfile = async (req, res) => {
  const user = req.user;
  const { name, email, profilePic, restaurantName, restaurantInfo } = req.body;

  if (!name || !email) {
    return res.status(400).json("Name and email are required");
  }

  if (email !== user.email) {
    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res.status(400).json("Email already registered");
    }
  }

  user.name = name;
  user.email = email;
  user.profilePic = profilePic;

  if (user.role === "owner") {
    if (!restaurantName) {
      return res.status(400).json("Restaurant name is required for restaurant owners");
    }
    user.restaurantName = restaurantName;
    user.restaurantInfo = restaurantInfo;
  }

  await user.save();
  const updatedUser = user.toObject();
  delete updatedUser.password;
  res.json(updatedUser);
};

exports.getRestaurants = async (req, res) => {
  const restaurants = await User.find({ role: "owner" }, "name restaurantName _id");
  res.json(restaurants);
};

exports.enrollRestaurant = async (req, res) => {
  const student = req.user;
  const { restaurantId } = req.body;

  if (student.role !== "student") return res.status(403).json("Only students can enroll in a meal plan");
  if (!restaurantId) return res.status(400).json("Restaurant id is required");
  if (student.enrolledPackages?.some(item => item.restaurantId.toString() === restaurantId)) {
    return res.status(400).json("You are already enrolled in this restaurant");
  }

  const restaurant = await User.findById(restaurantId);
  if (!restaurant || restaurant.role !== "owner") return res.status(404).json("Restaurant not found");

  student.enrolledPackages = student.enrolledPackages || [];
  student.enrolledPackages.push({
    restaurantId: restaurant._id,
    restaurantName: restaurant.restaurantName || restaurant.name,
    enrolledAt: new Date(),
    mealCount: 0,
    totalAmount: 0
  });

  await student.save();
  res.json(student.enrolledPackages);
};

exports.removeFoodHistory = async (req, res) => {
  const user = req.user;
  const { foodId, date } = req.body;

  if (user.role !== "student") {
    return res.status(403).json("Only students can remove food history");
  }

  if (!foodId || !date) {
    return res.status(400).json("Food ID and date are required");
  }

  // Remove the food history item by matching foodId and date
  user.foodHistory = (user.foodHistory || []).filter(item => {
    const itemDate = new Date(item.date).toISOString().split('T')[0];
    const reqDate = new Date(date).toISOString().split('T')[0];
    return !(item.foodId?.toString() === foodId && itemDate === reqDate);
  });

  await user.save();
  const updatedUser = user.toObject();
  delete updatedUser.password;
  res.json({ message: "Food history item removed", user: updatedUser });
};

exports.getStudentDashboard = async (req, res) => {
  const student = req.user;

  if (student.role !== "student") {
    return res.status(403).json("Only students can access dashboard");
  }

  const enrolledData = (student.enrolledPackages || []).map(pkg => {
    const pkgRestaurantId = pkg.restaurantId ? pkg.restaurantId.toString() : null;
    // Calculate statistics from food history for this restaurant
    const restaurantFoods = (student.foodHistory || []).filter(
      item => item.restaurantId && pkgRestaurantId && item.restaurantId.toString() === pkgRestaurantId
    );

    const mealCount = restaurantFoods.length;
    const totalAmount = restaurantFoods.reduce((sum, item) => sum + (item.price * (item.quantity || 1)), 0);

    return {
      restaurantId: pkg.restaurantId,
      restaurantName: pkg.restaurantName,
      enrolledAt: pkg.enrolledAt,
      mealCount,
      totalAmount
    };
  });

  const totalMeals = enrolledData.reduce((sum, r) => sum + r.mealCount, 0);
  const totalSpent = enrolledData.reduce((sum, r) => sum + r.totalAmount, 0);

  res.json({
    restaurants: enrolledData,
    totalMeals,
    totalSpent,
    restaurantCount: enrolledData.length
  });
};

exports.unenrollRestaurant = async (req, res) => {
  const student = req.user;
  const { restaurantId } = req.body;

  if (student.role !== "student") {
    return res.status(403).json("Only students can unenroll");
  }

  if (!restaurantId) {
    return res.status(400).json("Restaurant ID is required");
  }

  // Remove the enrolled package
  student.enrolledPackages = (student.enrolledPackages || []).filter(
    pkg => pkg.restaurantId.toString() !== restaurantId
  );

  // Remove all food history from this restaurant
  student.foodHistory = (student.foodHistory || []).filter(
    item => item.restaurantId?.toString() !== restaurantId
  );

  await student.save();
  const updatedUser = student.toObject();
  delete updatedUser.password;
  res.json({ message: "Unenrolled successfully and deleted all history from this restaurant", user: updatedUser });
};
