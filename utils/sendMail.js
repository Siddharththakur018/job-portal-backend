const nodemailer = require('nodemailer');

const transporter = nodemailer.createTransport({
    host: "smtp.gmail.com",
    port: 465,
    auth: {
        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_PASSWORD
    }
})

const sendOTPEmail = async(email, otp) => {
    await transporter.sendMail({
        from: process.env.EMAIL_USER,
        to: email,
        subject: "Job Portal OTP Verification",
        text: `Your OTP for Job Portal verification is: ${otp}. It will expire in 10 minutes.`
    })
}

module.exports = sendOTPEmail;