const mongoose = require("mongoose");

const GameSchema = new mongoose.Schema({
  datePlayed: Date,
  gameState: Object,
});

// compile model from schema
module.exports = mongoose.model("game", GameSchema);
