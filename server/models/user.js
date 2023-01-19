const mongoose = require("mongoose");

const UserSchema = new mongoose.Schema({
  name: String,
  googleid: String,
  role: String,
  creation_date: String,
  sets: [String],
});

// compile model from schema
module.exports = mongoose.model("user", UserSchema);
