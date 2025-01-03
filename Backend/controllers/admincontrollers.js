
const User = require("../models/usermodele.js");

exports.getallusers = async (req, res) => {
    try {
        const users = await User.find();
        res.status(200).json(users);
    } catch (error) {
        console.error("Error fetching users:", error);
        res.status(500).json({ message: "Failed to fetch users. Please try again later." });
    }
}