const mongoose = require("mongoose");

const UserSchema = new mongoose.Schema({
  name: String,
  displayname: String,
  googleid: String,
  role: String,
  creation_date: { type: Date, default: Date.now },
  sets: { type: [String], default: [] },
  games: { type: [String], default: [] },
  games_played: { type: Number, default: 0 },
  games_won: { type: Number, default: 0 },
  tags: { type: Number, default: 0 },
  tagged: { type: Number, default: 0 },
});

// compile model from schema
module.exports = mongoose.model("user", UserSchema);
