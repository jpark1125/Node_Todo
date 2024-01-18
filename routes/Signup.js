const express = require("express");
const router = express.Router();
const signupController = require("../controller/Signup");

// 회원가입 API
router.post("/signup", signupController.Signup);

// 이메일 중복 확인 API
router.post("/emailcheck", signupController.Checkemail);

// 아이디 중복 확인 API
router.post("/idcheck", signupController.Checkid);

module.exports = router;
