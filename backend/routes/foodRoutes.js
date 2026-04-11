const router = require("express").Router();
const authMiddleware = require("../middleware/authMiddleware");
const { addFood, getFoods, getFoodsByOwner, updateFood, deleteFood } = require("../controllers/foodController");

router.get("/", getFoods);
router.get("/restaurant/:ownerId", getFoodsByOwner);
router.post("/add", authMiddleware, addFood);
router.put("/:foodId", authMiddleware, updateFood);
router.delete("/:foodId", authMiddleware, deleteFood);

module.exports = router;
