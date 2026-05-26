const axios = require("axios");

const sendOtpSms = async (phone, otp) => {
  try {
    const cleanPhone = phone.replace(/^\+91/, "").replace(/\D/g, "");

    const response = await axios.get(
      `https://www.fast2sms.com/dev/bulkV2`,
      {
        params: {
          authorization: process.env.FAST2SMS_API_KEY,
          message: `Your Productr login OTP is ${otp}. Valid for 5 minutes.`,
          language: "english",
          route: "q",
          numbers: cleanPhone,
        }
      }
    );

    if (!response.data.return) {
      throw new Error(response.data.message || "Failed to send OTP via SMS.");
    }

    return response.data;

  } catch (error) {
    throw new Error(error.response?.data?.message || error.message || "SMS sending failed.");
  }
};

module.exports = { sendOtpSms };


