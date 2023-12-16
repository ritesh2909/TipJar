const mongoose = require("mongoose");


const dbSetup = () =>
  mongoose
    .connect(process.env.MONGO_URI)
    .then(() => console.log("DB Connected"))
    .catch((err) => console.log(err));

module.exports = { dbSetup };
