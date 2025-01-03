const sendEmail = require("../utils/sendemail");
const userModel = require("../models/usermodele");
const jwt = require("jsonwebtoken");
const dotenv = require("dotenv");

dotenv.config();

const { generateOtp, storeOtp, verifyOtp } = require("../utils/OtpUtil");

// Register User
exports.register = async (req, res, next) => {
  try {
    const { username, email } = req.body;

    if (!username || !email) {
      return res.status(400).json({ message: "Username and email are required!" });
    }

    const userExist = await userModel.findOne({ email }).exec();
    if (userExist && userExist.verified) {
      return res.status(400).json({ message: "User already exists. Please log in!" });
    }

    if (!userExist) {
      const newUser = new userModel({ username, email, verified: false });
      await newUser.save();
    }

    const otp = generateOtp();
    storeOtp(email, otp);

    await sendEmail(
      email,
      "Verify Your ZipChat Account",
      `Your OTP is "${otp}" and it's valid for 1 minute. Keep your OTP safe!`
    );

    res.status(200).json({ message: "OTP sent successfully!" });
  } catch (error) {
    next(error);
  }
};

// Verify OTP
exports.verifyOtp = async (req, res, next) => {
  try {
    const { email, otp } = req.body;

    if (!email || !otp) {
      return res.status(400).json({ message: "Email and OTP are required!" });
    }

    if (!verifyOtp(email, otp)) {
      return res.status(400).json({ message: "Invalid or expired OTP!" });
    }

    const user = await userModel.findOneAndUpdate(
      { email }, // Filter
      { verified: true, login: true }, // Update fields
      { new: true } // Return the updated document
    );

    if (!user) {
      return res.status(404).json({ message: "User not found!" });
    }

    const token = jwt.sign({ id: user._id, email }, process.env.JWT_SECRET, { expiresIn: "10h" });
    res.status(200).json({ message: "OTP verified successfully!", token,user });
  } catch (error) {
    next(error);
  }
};

// Login User
exports.login = async (req, res, next) => {
  try {
    const { email } = req.body;

    if (!email) {
      return res.status(400).json({ message: "Email is required!" });
    }

    const user = await userModel.findOne({ email }).exec();
    if (!user) {
      return res.status(404).json({ message: "User not found! Please register." });
    }

    const otp = generateOtp();
    storeOtp(email, otp);

    await sendEmail(
      email,
      "Verify Your ZipChat Account",
      `Your OTP is "${otp}" and it's valid for 1 minute. Keep your OTP safe!`
      
    );

    // Update login status
    const updatedUser = await userModel.findOneAndUpdate(
      { email },
      { login: true },
      { new: true }
    );

    // Generate token
    const token = jwt.sign({ id: updatedUser._id, email }, process.env.JWT_SECRET, { expiresIn: "1h" });

    res.status(200).json({
      message: "OTP sent to Sucessfully!,verify your account!",
      user: updatedUser,
      token,
    });
  } catch (error) {
    next(error);
  }
};

// Logout User
exports.logout = async (req, res, next) => {
  try {
    const { email } = req.body;

    if (!email) {
      return res.status(400).json({ message: "Email is required!" });
    }

    const user = await userModel.findOne({ email }).exec();

    if (!user) {
      return res.status(404).json({ message: "User not found!" });
    }

    // Update the user's login status to false
    await userModel.findOneAndUpdate({ email }, { login: false }, { new: true });

    res.status(200).json({ message: "Logout successful!" });
  } catch (error) {
    next(error);
  }
};

// Profile Endpoint
exports.profile = async (req, res, next) => {
  try {
    // Extract the token from the Authorization header
    const token = req.headers.authorization?.split(" ")[1];

    if (!token) {
      return res.status(401).json({ message: "Access denied. No token provided." });
    }

    // Verify the token
    let decoded;
    try {
      decoded = jwt.verify(token, process.env.JWT_SECRET);
    } catch (error) {
      return res.status(401).json({ message: "Invalid or expired token." });
    }

    // Find the user by ID
    const user = await userModel.findById(decoded.id).select("-password"); // Exclude password from the response
    if (!user) {
      return res.status(404).json({ message: "User not found." });
    }

    // Return user details
    res.status(200).json({
      user: {
        _id: user._id,
        username: user.username,
        email: user.email,
        verified: user.verified,
        profilePicture: user.profilePicture
      },
    });
  } catch (error) { 
    next(error);
  }
};

