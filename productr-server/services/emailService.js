const { Resend } = require('resend');
const resend = new Resend(process.env.RESEND_API_KEY);

const sendOtpEmail = async (email, otp) => {
  await resend.emails.send({
    from: 'Productr <onboarding@resend.dev>',
    to: email,
    subject: 'Your Productr Login OTP',
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