const User = require("../models/User");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");

exports.register = async (req, res) => {
  const { name, email, password, role, profilePic, restaurantName, restaurantInfo } = req.body;
  if (!name || !email || !password || !role) {
    return res.status(400).json("Missing required fields");
  }

  const existingUser = await User.findOne({ email });
  if (existingUser) {
    return res.status(400).json("Email already registered");
  }

  if (role === "owner" && !restaurantName) {
    return res.status(400).json("Restaurant name is required for restaurant owners");
  }

  const hashed = await bcrypt.hash(password, 10);
  const user = await User.create({
    name,
    email,
    password: hashed,
    role,
    profilePic,
    restaurantName,
    restaurantInfo
  });

  const safeUser = user.toObject();
  delete safeUser.password;
  res.json(safeUser);
};

exports.login = async (req, res) => {
  const user = await User.findOne({ email: req.body.email });
  if (!user) return res.status(400).json("User not found");

  const match = await bcrypt.compare(req.body.password, user.password);
  if (!match) return res.status(400).json("Wrong password");

  const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET || "secret123");
  const safeUser = user.toObject();
  delete safeUser.password;

  res.json({ user: safeUser, token });
};

exports.me = async (req, res) => {
  res.json(req.user);
};
