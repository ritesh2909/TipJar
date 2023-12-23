const express = require("express");
const authController = require("../controllers/auth.controller");

const router = express.Router();

router.post("/v1/request-otp/:mobile", authController.requestOtp);
router.post("/v1/register", authController.registerUser);
router.post("/v1/otp-login", authController.otpLogin);
router.post("/v1/google-login", authController.googleLogin);
router.post("/v1/password/register", authController.passwordRegister);
router.post("/v1/password/login", authController.passwordLogin);
exports.router = router;
