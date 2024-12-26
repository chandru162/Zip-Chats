const express = require("express");
const router = express.Router();
const { register, login, verifyOtp , profile } = require("../controllers/authcontrollers");

router.post("/register", register);
router.post("/verify-otp", verifyOtp);
router.post("/login", login);
router.get("/profile", profile);
// Add routes for login, forgotPassword, resetPassword


module.exports = router;
