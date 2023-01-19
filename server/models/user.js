const mongoose = require("mongoose");

const UserSchema = new mongoose.Schema({
  name: String,
  googleid: String,
  role: String,
  date: Date,
  sets: mongoose.Schema.Types.Mixed,
});

// compile model from schema
module.exports = mongoose.model("user", UserSchema);
