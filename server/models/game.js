const mongoose = require("mongoose");

const GameSchema = new mongoose.Schema({
  dateplayed: Date,
  pin: String,
  gamestate: Object,
});

// compile model from schema
module.exports = mongoose.model("game", GameSchema);
