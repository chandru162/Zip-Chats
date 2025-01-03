const User = require("../models/usermodele.js");



// Update Profile Picture
exports.updateProfilePicture = async (req, res) => {
    const { userId } = req.body;
    const filePath = req.file?.path; // Check if `req.file` exists and get `path`

    if (!userId || !filePath) {
        return res.status(400).json({ message: "User ID and file are required!" });
    }

    try {
        const user = await User.findOneAndUpdate(
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

// Add Friend
exports.addFriend = async (req, res) => {
    const { userId, friendId } = req.body;
    console.log({ userId, friendId });

    if (!userId || !friendId) {
        return res.status(400).json({ message: "User ID and Friend ID are required!" });
    }

    try {
        const user = await User.findOne({email:userId});
        const friend = await User.findOne({email:friendId});

        if (!user || !friend) {
            return res.status(404).json({ message: "User or Friend not found!" });
        }

        if (user.friends.includes({friendId})) {
            return res.status(400).json({ message: "Friend already added!" });
        }

        user.friends.push(friendId);
        await user.save();

        res.status(200).json({ message: "Friend added successfully!" });
    } catch (error) {
        console.error("Error adding friend:", error);
        res.status(500).json({ message: "Add friend failed. Please try again later." });
    }
};
// Remove Friend
exports.removeFriend = async (req, res) => {
    const { userId, friendId } = req.body;

    if (!userId || !friendId) {
        return res.status(400).json({ message: "User ID and Friend ID are required!" });
    }

    try {
        const user = await User.findOne({email:userId});

        if (!user) {
            return res.status(404).json({ message: "User not found!" });
        }

        const friendIndex = user.friends.indexOf({friendId});
        if (friendIndex === -1) {
            return res.status(400).json({ message: "Friend not found in user's friend list!" });
        }

        user.friends.splice(friendIndex, 1);
        await user.save();

        res.status(200).json({ message: "Friend removed successfully!" });
    } catch (error) {
        console.error("Error removing friend:", error);
        res.status(500).json({ message: "Remove friend failed. Please try again later." });
    }
};
// Fetch Friends
exports.fetchFriends = async (req, res) => {
    const { userId } = req.body;

    if (!userId) {
        return res.status(400).json({ message: "User ID is required!" });
    }

    try {
        const user = await User.findOne({ email: userId }).exec();

        if (!user) {
            return res.status(404).json({ message: "User not found!" });
        }

        const friends = user.friends;
        const allUsers = await User.find();
        const valueArray = Object.values(allUsers);

        const friendsDetails = valueArray.filter(user => friends.includes(user.email));

        res.status(200).json({ friends: friendsDetails });
        
    } catch (error) {
        console.error("Error fetching friends:", error);
        res.status(500).json({ message: "Fetch friends failed. Please try again later." });
    }
};


