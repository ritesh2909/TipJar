const { UsersTrack, UsersTrackType } = require("../models/users-track.model");

const usersTrackRegister = async (userId, source) => {
  try {
    const usersTrack = new UsersTrack({
      userId: userId,
      loginAt: new Date(),
      type: UsersTrackType.REGISTER,
      loginSrc: source,
    });
    await usersTrack.save();
  } catch (error) {
    console.error(error);
  }
};

const usersTrackLogin = async (userId, source) => {
  try {
    const usersTrack = new UsersTrack({
      userId: userId,
      loginAt: new Date(),
      type: UsersTrackType.LOGIN,
      loginSrc: source,
    });
    await usersTrack.save();
  } catch (error) {
    console.error(error);
  }
};

module.exports = { usersTrackLogin, usersTrackRegister };
