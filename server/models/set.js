const mongoose = require("mongoose");

const SetSchema = new mongoose.Schema({
  name: String,
  creation_date: { type: Date, default: Date.now },
  last_modified_date: { type: Date, default: Date.now },
  title: String,
  size: Number,
  cards: [String],
});

// compile model from schema
module.exports = mongoose.model("set", SetSchema);
