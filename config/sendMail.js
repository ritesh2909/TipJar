var nodemailer = require("nodemailer");

var transporter = nodemailer.createTransport({
  service: "gmail",
  port: 587,
  auth: {
    user: "ritesharora2608@gmail.com",
    pass: "npbshcwzkvmopnxi",
  },
});

const sendNewOtpMail = (otp, to, type) => {
  const title = `Your OTP for ${type} on TipJar`;
  const body = `Hi,

    ${otp} is the OTP to access your account on TipJar.
    
    This OTP is valid for 10 minutes & usable once.`;
  try {
    console.log("Trying sending mail");
    sendNewMail(to, title, body);
  } catch (error) {
    console.log("mail sending failed!");
    console.log(error);
  }
};

const sendNewMail = (to, subject, text) => {
  var mailOptions = {
    from: "ritesharora2608@gmail.com",
    to: to,
    subject: subject,
    text: text,
  };

  try {
    transporter.sendMail(mailOptions, function (error, info) {
      if (error) {
        console.log(error);
      } else {
        console.log("Email sent: " + info.response);
      }
    });
  } catch (error) {
    console.log(error);
  }
};

module.exports = { sendNewMail, sendNewOtpMail };
