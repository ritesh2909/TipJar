const mongoose = require("mongoose");
const { Schema } = mongoose;

const UsersTrackLoginSource = {
  WEBSITE: "WEBSITE",
  APP: "APP",
};

const UsersTrackType = {
  LOGIN: "LOGIN",
  REGISTER: "REGISTER",
};

const userTrackSchema = new Schema(
  {
    userId: {
      type: Schema.Types.ObjectId,
      ref: "User", // userId of the user
    },
    loginAt: {
      type: Date,
    },
    loginSrc: {
      type: String,
    },
    type: {
      type: String,
    },
  },
  { timestamps: true }
);

const UsersTrack = mongoose.model("UsersTrack", userTrackSchema);
module.exports = {
  userTrackSchema,
  UsersTrack,
  UsersTrackLoginSource,
  UsersTrackType,
};
