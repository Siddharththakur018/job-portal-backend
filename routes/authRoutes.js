const express = require('express');
const router = express.Router();

const {registerUser, verifyOtp, loginUser, logoutUser, me} = require("../controller/authController")

router.post('/register', registerUser);
router.post('/verify-otp', verifyOtp);
router.post('/login', loginUser);
router.post('/logout', logoutUser);

router.get('/me', me)
module.exports = router; 