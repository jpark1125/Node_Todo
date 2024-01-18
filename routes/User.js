const express = require("express");
const userController = require("../controller/User");

const router = express.Router();

router.post("/register", userController.Signup);

// 컨트롤러를 가져옵니다.
const { UserController: controller } = require("../controller");

// 인증 확인을 위한 미들웨어를 가져옵니다.
const { Check } = require("../middleware/isAuth");

// express의 Router 인스턴스를 생성합니다.

router.post("/register", userController.Signup);
// 회원가입 API
router.post("/signup", controller.Signup);

// 로그인 API
router.post("/login", controller.Login);

// 이메일 중복 확인 API
router.post("/emailcheck", controller.Checkemail);

// 아이디 중복 확인 API
router.post("/idcheck", controller.Checkid);

// 토큰 발급 API
router.post("/token", controller.IssueToken);

module.exports = router;
