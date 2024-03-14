const Router = require("express");
const router = new Router();
const userController = require("../controllers/userController");
const authMiddleware = require("../middleware/authMiddleware");

router.post("/signin", userController.signin);

router.post("/signup", userController.signup);

router.get("/auth", authMiddleware, userController.userCheck);

module.exports = router;
