const User = require("../model/authModel");
const bcrypt = require("bcryptjs");
const saltRound = 10;
const sendOTPEmail = require("../utils/sendMail");

exports.registerUser = async (req, res) => {
  try {
    const { name, email, password, role } = req.body;

    const existingUser = await User.findOne({ email });

    if (existingUser) {
      return res.status(400).json({ message: "User already exists" });
    }

    const hashedPassword = await bcrypt.hash(password, saltRound);

    const otp = Math.floor(100000 + Math.random() * 900000).toString();

    const newUser = new User({
      name,
      email,
      password: hashedPassword,
      role,
      otp,
      otpExpiry: Date.now() + 10 * 60 * 1000,
    });

    await newUser.save();

    await sendOTPEmail(email, otp);

    return res.status(201).json({
      message: "User registered successfully. OTP sent.",
    });
  } catch (error) {
    console.log(error);
    return res.status(500).json({ message: error.message });
  }
};

exports.verifyOtp = async (req, res) => {
  try {
    const { email, otp } = req.body;

    const user = await User.findOne({ email });

    if (!user) {
      return res.status(400).json({ message: "User not found!" });
    }

    if (user.otp !== otp) {
      return res.status(400).json({ message: "Invalid OTP!" });
    }

    if (user.otpExpiry < Date.now()) {
      return res.status(400).json({ message: "OTP Timeout!" });
    }

    user.isVerified = true;
    user.otp = null;
    user.otpExpiry = null;

    await user.save();

    return res.json({ message: "Email verified successfully" });
  } catch (error) {
    console.error(error);
    return res.status(500).json({ message: error.message });
  }
};
exports.loginUser = async (req, res) => {
  try {
    const { email, password } = req.body;

    const user = await User.findOne({ email });

    if (!user) {
      return res.status(400).json({ message: "User not found!" });
    }

    if (!user.isVerified) {
      return res.status(400).json({ message: "Verify email first" });
    }

    const match = await bcrypt.compare(password, user.password);

    if (!match) {
      return res.status(400).json({ message: "Wrong password" });
    }

    req.session.userId = user._id;

    return res.status(200).json({
      message: "Login successful",
      user: {
        id: user._id,
        name: user.name,
        email: user.email,
        role: user.role,
      },
    });
  } catch (error) {
    console.error(error);
    return res.status(500).json({ message: error.message });
  }
};

exports.me = async (req, res) => {
  try {
    if (!req.user.sessionId) {
      return res.status(401).json({ message: "Not Authenticated" });
    }
    const user = await User.findById(req.session.userId).select(
      "-password -otp -otpExpiry",
    );

    if (!user) {
      return res.status(404).json({ message: "User not found!" });
    }

    return res.status(200).json({ user });
  } catch (error) {
    console.error(error);
    return res.status(500).json({ message: error.message });
  }
};

exports.logoutUser = (req, res) => {
  req.session.destroy((err) => {
    if (err) {
      return res.status(500).json({ message: "Logout failed" });
    }

    res.clearCookie("sid");
    res.json({ message: "Logged out successfully" });
  });
};