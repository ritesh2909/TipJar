const twilio = require("twilio");

// Twilio credentials
const accountSid = "ACcf13d517144bf597ebdf27c5ede52b98";
const authToken = "0418c09aecafad76d84fe80da69a1e98";
const twilioPhoneNumber = "+15737794220";

const client = twilio(accountSid, authToken);

// Send OTP via SMS
const sendOTP = async (otpBody, toPhoneNumber) => {
  try {
    const message = await client.messages.create({
      body: otpBody,
      from: twilioPhoneNumber,
      to: "+91" + toPhoneNumber,
    });

    console.log("OTP sent successfully:", message.sid);
  } catch (error) {
    console.error("Error sending OTP:", error);
  }
};

module.exports = { sendOTP };
