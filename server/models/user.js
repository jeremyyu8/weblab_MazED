const mongoose = require("mongoose");

const UserSchema = new mongoose.Schema({
  name: String,
  displayname: String,
  googleid: String,
  role: String,
  creation_date: { type: Date, default: Date.now },
  sets: { type: [String], default: [] },
});

// compile model from schema
module.exports = mongoose.model("user", UserSchema);
