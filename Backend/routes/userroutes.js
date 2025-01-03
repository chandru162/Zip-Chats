const express = require('express');
const router = express.Router();
const {
    register,
    verifyOtp,
    login,
    logout,
    profile,
} = require('../controllers/authcontrollers');
const {
    addFriend,
    removeFriend,
    fetchFriends,
    updateProfilePicture
} = require("../controllers/usercontrollers");


// Routes for user operations
router.post("/register", register); // Route for user registration
router.post("/verify-otp", verifyOtp); // Route for OTP verification
router.post("/login", login); // Route for user login
router.post("/logout", logout); // Route for user logout
router.get("/profile", profile); // Route for getting user profile

router.post("/addfriend", addFriend); // Route for adding a friend
router.post("/friends", fetchFriends); // Route for fetching friends list
router.delete('/removefriend', removeFriend)
router.post("/update-profile-picture", updateProfilePicture); // Route for updating user profile picture

module.exports = router;
