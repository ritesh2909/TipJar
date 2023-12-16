const { User, UserStatusEnum } = require("../models/user.model");
const { newOtp } = require("../config/generateOtp");
const { OAuth2Client } = require("google-auth-library");
const { generateToken } = require("../config/jwtToken");
const { sendNewOtpMail } = require("../config/sendMail");
const moment = require("moment");

exports.requestOtp = async (req, res) => {
  const mobile = req.params.mobile;
  if (!mobile) {
    return res.status(422).json("Mobile Number not found!");
  }
  if (mobile.length != 10) {
    return res.status(422).json("Invalid Mobile Number!");
  }
  const user = await User.findOne({ mobile });

  if (user) {
    // user already exists
    const otpGenerated = newOtp();
    user.passwordResetOtp = otpGenerated;
    (user.otpExpires = moment().add(10, "minutes")), await user.save();
    const otpBody = `${otpGenerated} is your OTP to login to TipJar. DO NOT share otp with anyone. TipJar never ask for OTP. This otp expires in 10 mins.`;
    sendNewOtpMail(otpGenerated, user.email, "Login");
    try {
      const token = await generateToken(user?._id);
      await User.findByIdAndUpdate(
        user?.id,
        {
          token: token,
          lastLogin: new Date(),
        },
        { $new: true }
      );
      // sendOTP(otpBody, mobile); // uncomment this to start otp service
      return res.status(204).json("OTP Sent Successfully!");
    } catch (error) {
      console.log(error);
    }
  } else {
    // user donot exists
    return res
      .status(404)
      .json("Mobile number not registered. Please sign up first!");
  }
};

exports.registerUser = async (req, res) => {
  const { email, mobile } = req.body;
  if (!mobile) {
    return res.status(422).json("Mobile Number not found!");
  }
  if (mobile.length != 10) {
    return res.status(422).json("Invalid Mobile Number!");
  }
  let existingUser = await User.findOne({ mobile });
  if (existingUser && existingUser.status !== UserStatusEnum.PENDING) {
    return res
      .status(400)
      .json("Mobile number already registered. Please login!");
  }
  existingUser = await User.findOne({ email });
  if (existingUser) {
    return res.status(400).json("Email already used. Please login!");
  }

  const newUser = new User(req.body);
  try {
    newUser.status = UserStatusEnum.VERIFICATION_PENDING;
    const otpGenerated = newOtp();
    newUser.passwordResetOtp = otpGenerated;
    newUser.otpExpires = moment().add(10, "minutes");
    const savedUser = await newUser.save();
    const otpBody = `${otpGenerated} is your OTP to login to TipJar. DO NOT share otp with anyone. TipJar never ask for OTP. This otp expires in 10 mins.`;
    try {
      const token = await generateToken(savedUser?._id);
      await User.findByIdAndUpdate(
        savedUser?.id,
        {
          token: token,
          lastLogin: new Date(),
        },
        { $new: true }
      );
      // sendOTP(otpBody, mobile); // uncomment this to start otp service
      try {
        sendNewOtpMail(otpGenerated, newUser.email, "Registeration");
      } catch (error) {
        console.error(error);
      }
      return res.status(204).json("OTP Sent Successfully!");
    } catch (err) {
      console.error(err);
      return res.status(500).json("Internal Server Error!");
    }
  } catch (error) {
    console.error(error);
    return res.status(500).json("Internal Server Error");
  }
};

exports.otpLogin = async (req, res) => {
  const mobile = req.body.mobile;
  const otp = req.body.otp;

  let user = await User.findOne({
    mobile,
  });

  if (!user) {
    return res.status(404).json("User with Mobile Number not found!");
  }

  user = await User.findOne({
    mobile: mobile,
    passwordResetOtp: otp,
  });

  if (!user) {
    return res.status(400).json("Invalid Otp!");
  }
  if (moment().isAfter(user.otpExpires)) {
    return res.status(410).json({ message: "OTP has expired" });
  }
  try {
    if (user.status === UserStatusEnum.VERIFICATION_PENDING) {
      // new user
      user.status = UserStatusEnum.VERIFIED;
    }
    user.passwordResetOtp = "";
    user.otpExpires = "";
    await user.save();
    return res.status(200).json({ authToken: user.token });
  } catch (error) {
    console.log(error);
  }
};

exports.googleLogin = async (req, res) => {
  const { idToken, email } = req.body;
  const oAuth2Client = new OAuth2Client();
  let result;
  try {
    result = await oAuth2Client.verifyIdToken({
      idToken: idToken,
    });
  } catch (error) {
    console.error(error);
    return res.status(422).json("Invalid Google token!");
  }
  const payLoad = result.getPayload();
  if (!payLoad?.sub) {
    return res.status(422).json("Invalid google token");
  }
  if (payLoad.email !== email) {
    return res.status(400).json("Token do not belong to verified email");
  }

  const existingUser = (
    await User.find({
      where: {
        or: [{ googleToken: payLoad.sub }, { email: payLoad.email }],
      },
    })
  )[0];
  if (existingUser) {
    if (existingUser.googleToken) {
      if (existingUser?.googleToken !== payLoad.sub) {
        return res.status(422).json("Invalid Google Token");
      }
    }
    const accessToken = generateToken(existingUser.id);
    await User.findByIdAndUpdate(existingUser.id, {
      googleToken: payLoad.sub,
      isSocialLogin: true,
      accessToken: accessToken,
    });
    const userRes = {
      id: existingUser.id,
      firstName: existingUser.firstName,
      lastName: existingUser.lastName,
      middleName: existingUser.middleName,
      mobile: existingUser.mobile,
      email: existingUser.email,
      personalAuthToken: accessToken,
    };

    return res.status(200).json(userRes);
  } else {
    // sending to the register screen and registering there
    return res.status(417).json("User does not exist");
  }
};
