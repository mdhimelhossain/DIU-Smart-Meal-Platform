const router = require("express").Router();
const { getProfile, updateProfile, getRestaurants, enrollRestaurant, removeFoodHistory, getStudentDashboard, unenrollRestaurant } = require("../controllers/userController");
const authMiddleware = require("../middleware/authMiddleware");

router.get("/profile", authMiddleware, getProfile);
router.put("/profile", authMiddleware, updateProfile);
router.get("/restaurants", authMiddleware, getRestaurants);
router.get("/dashboard", authMiddleware, getStudentDashboard);
router.post("/enroll", authMiddleware, enrollRestaurant);
router.post("/unenroll", authMiddleware, unenrollRestaurant);
router.delete("/foodhistory", authMiddleware, removeFoodHistory);

module.exports = router;
