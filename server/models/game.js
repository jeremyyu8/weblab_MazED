const mongoose = require("mongoose");

const GameSchema = new mongoose.Schema({
  gameState: Object,
});

// compile model from schema
module.exports = mongoose.model("game", GardSchema);
