var mongoose = require('mongoose');
var CartaSchema = require('./cartaSchema');

var UserSchema = new mongoose.Schema({
  idUser: String,
  idSala: String,
  idSocket: String,
  status: String,
  nome: String,
  isJogador: Boolean,
  voto: CartaSchema
});

module.exports = mongoose.model('User', UserSchema)