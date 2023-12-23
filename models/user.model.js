const mongoose = require("mongoose");
const { Schema } = mongoose;

const UserStatusEnum = {
  PENDING: "PENDING",
  VERIFICATION_PENDING: "VERIFICATION_PENDING",
  VERIFIED: "VERIFIED",
  SUSPENDED: "SUSPENDED",
  DELETED: "DELETED",
};
const userSchema = new Schema(
  {
    status: {
      type: String, // String from enum
    },
    firstName: {
      type: String,
    },
    middleName: {
      type: String,
    },
    lastName: {
      type: String,
    },
    email: {
      type: String,
      unique: true,
    },
    mobile: {
      type: String,
      unique: true,
    },
    isSocialLogin: {
      type: Boolean,
    },
    iSignupByRefferal: {
      type: Boolean,
    },
    bio: {
      type: String,
    },
    image: {
      type: String,
    },
    googleToken: String,
    appleToken: String,
    lastLogin: { type: Date },
    password: { type: String },
    token: { type: String },
    passwordChangedAt: {
      type: Date,
    },
    passwordResetOtp: {
      type: String,
    },

    otpExpires: {
      type: Date,
    },
    isMobileVerified: {
      type: Boolean,
    },
    gender: {
      type: String,
    },
    fcmToken: String,
    countryCode: String, // 91
  },
  { timestamps: true }
);

const User = mongoose.model("User", userSchema);
module.exports = { User, UserStatusEnum };
