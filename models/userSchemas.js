var mongoose = require('mongoose');

const VotoSchema = new mongoose.Schema({
  id: Number,
  value: Number,
  label: String,
  type: String
})

var UserSchema = new mongoose.Schema({
  idUser: String,
  idSala: String,
  idSocket: String,
  status: String,
  nome: String,
  isJogador: String,
  voto: VotoSchema
});

module.exports = mongoose.model('User', UserSchema)