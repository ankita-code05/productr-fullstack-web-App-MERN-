// productr-server/services/emailService.js

const nodemailer = require("nodemailer");

const transporter = nodemailer.createTransport({
  host: 'smtp.gmail.com',
  port: 587,
  secure: false,
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASS,
  },
});

const sendOtpEmail = async (email, otp) => {
  await transporter.sendMail({
    from: `"Productr" <${process.env.EMAIL_USER}>`,
    to: email,
    subject: "Your Productr Login OTP",
    html: `
      <div style="font-family: Arial, sans-serif; max-width: 400px; margin: auto;">
        <h2 style="color: #1a1aff;">Login to Productr</h2>
        <p>Your One-Time Password is:</p>
        <h1 style="letter-spacing: 8px; color: #333;">${otp}</h1>
        <p>This OTP is valid for <strong>5 minutes</strong>.</p>
        <p style="color: #999; font-size: 12px;">
          If you did not request this, please ignore this email.
        </p>
      </div>
    `,
  });
};

module.exports = { sendOtpEmail };