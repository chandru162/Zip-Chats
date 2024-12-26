const express = require("express");
const {
    register,
    verifyOtp,
    login,
    logout,
    profile,
} = require("../controllers/userController");

const router = express.Router();

// Routes for user operations
router.post("/register", register); // Route for user registration
router.post("/verify-otp", verifyOtp); // Route for OTP verification
router.post("/login", login); // Route for user login
router.post("/logout", logout); // Route for user logout
router.get("/profile", profile); // Route for getting user profile

module.exports = router;
