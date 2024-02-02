const express = require("express");
const router = express.Router();
const signupController = require("../controller/Signup");

router.post("/signup", signupController.Signup);

router.post("/emailcheck", signupController.Checkemail);

router.post("/idcheck", signupController.Checkid);

module.exports = router;
