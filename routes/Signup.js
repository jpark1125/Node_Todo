const express = require("express");
const router = express.Router();
const signupController = require("../controllers/signup");

const { SignupController: controller } = require("../controller");

//router.post("/register", signupController.Signup);

module.exports = router;

// 회원가입 API
router.post("/signup", controller.Signup);

// 이메일 중복 확인 API
router.post("/emailcheck", controller.Checkemail);

// 아이디 중복 확인 API
router.post("/idcheck", controller.Checkid);
