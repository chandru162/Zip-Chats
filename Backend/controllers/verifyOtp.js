
// // const sendEmail = require("../utils/sendemail");
// const userModel = require("../models/userModel");

// exports.verifyOtp = async (req, res) => {
//     try {
//         const { email, otp } = req.body;
//         if (otpStore[email] === parseInt(otp)) {
//             // Mark user as verified (you may need to add a 'verified' field in User schema)
//             const User = new userModel({ username, email });
//             await User.save();
//             await userModel.findOneAndUpdate({ email }, { verified: true });
//             console.log(otpStore[email]);
//             delete otpStore[email];
//             res.status(200).json({ message: "OTP verified" });
//         } else {
//             res.status(400).json({ message: "Invalid OTP, please enter a valid number!" });
//         }
//     } catch (error) {
//         res.status(500).json({ message: "OTP Server error", error });
//     }
// };