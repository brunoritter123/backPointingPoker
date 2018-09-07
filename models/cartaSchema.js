var mongoose = require('mongoose');

const CartaSchema = new mongoose.Schema({
  id: Number,
  value: Number,
  label: String,
  type: String
})

module.exports = CartaSchema