const router = require("express").Router();
const {
  enroll,
  getCurrentPlan,
  selectMeal,
  removeMeal,
  getSummary,
  checkAndClosePlan,
  unenroll
} = require("../controllers/mealPlanController");
const authMiddleware = require("../middleware/authMiddleware");

router.post("/enroll", authMiddleware, enroll);
router.post("/unenroll", authMiddleware, unenroll);
router.get("/current", authMiddleware, getCurrentPlan);
router.post("/select", authMiddleware, selectMeal);
router.delete("/select", authMiddleware, removeMeal);
router.get("/summary", authMiddleware, getSummary);
router.post("/check", authMiddleware, checkAndClosePlan);

module.exports = router;