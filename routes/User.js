const express = require("express");
const userController = require("../controller/User");

const router = express.Router();

router.post("/register", userController.Signup);

const { UserController: controller } = require("../controller");

const { Check } = require("../middleware/isAuth");

router.post("/register", userController.Signup);

router.post("/login", controller.Login);

router.post("/token", controller.IssueToken);

module.exports = router;
