const User = require("../models/usermodele.js");

// Update Profile Picture
exports.updateProfilePicture = async (req, res) => {
    const { userId } = req.body;
    const filePath = req.file?.path; // Check if `req.file` exists and get `path`

    if (!userId || !filePath) {
        return res.status(400).json({ message: "User ID and file are required!" });
    }

    try {
        const user = await User.findByIdAndUpdate(
            userId,
            { profilePicture: filePath },
            { new: true }
        );

        if (!user) {
            return res.status(404).json({ message: "User not found!" });
        }

        res.status(200).json({
            message: "Profile picture updated successfully!",
            profilePicture: user.profilePicture,
        });
    } catch (error) {
        console.error("Error updating profile picture:", error);
        res.status(500).json({ message: "Update failed. Please try again later." });
    }
};
