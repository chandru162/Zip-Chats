
let otpStore = {};

// Generate OTP
const generateOtp = () => Math.floor(100000 + Math.random() * 900000);

// Store OTP
const storeOtp = (email, otp, duration = 60000) => {
    otpStore[email] = otp;

    // Expire OTP after specified duration
    setTimeout(() => {
        delete otpStore[email];
    }, duration);
};

// Verify OTP
const verifyOtp = (email, otp) => {
    const isValid = otpStore[email] === parseInt(otp);
    if (isValid) delete otpStore[email];
    return isValid;
};

module.exports = { generateOtp, storeOtp, verifyOtp };
