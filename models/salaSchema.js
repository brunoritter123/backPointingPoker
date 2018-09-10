var mongoose = require('mongoose');
var CartaSchema = require('./cartaSchema');

var SalaSchema = new mongoose.Schema({
  idSala: String,
  forceFimJogo: Boolean,
  jogadorFinaliza: Boolean,
  jogadorReseta:   Boolean,
  cartas: [CartaSchema]
});

module.exports = mongoose.model('Sala', SalaSchema)