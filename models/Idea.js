const mongoose = require("mongoose");
const Schema = mongoose.Schema;

//Create Schema
const IdeaSchema = new Schema({
  tittle: {
    type: String,
    required: true
  },
  details: {
    type: String,
    required: true
  },
  date: {
    type: Date,
    default: Date.now
  }
});

//Create Model
mongoose.model("Ideas", IdeaSchema);
