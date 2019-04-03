const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const noteSchema = new Schema({
  title: String,
  description: String
});

module.exports = mongoose.model('Note', noteSchema);