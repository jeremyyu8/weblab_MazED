const mongoose = require("mongoose");

const CardSchema = new mongoose.Schema({
  question: String,
  choices: [String],
  answers: [Number],
});

// compile model from schema
module.exports = mongoose.model("card", CardSchema);
