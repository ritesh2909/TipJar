const mongoose = require("mongoose");
const { Schema } = mongoose;

const userFollowingSchema = new Schema(
  {
    status: {
      type: String, // String from enum
    },
    followerId: {
      type: String,
    },
    follwingId: {
      type: String,
    },
  },
  { timestamps: true }
);

const UserFollowing = mongoose.model("UserFollowing", userFollowingSchema);
module.exports = { UserFollowing };
