var mongoose = require('mongoose');
var CartaSchema = require('./cartaSchema');
var AcoesSalaSchema = require('./acoesSalaSchema');

var SalaSchema = new mongoose.Schema({
  idSala:         String,
  forceFimJogo:   Boolean,
  finalizar:      AcoesSalaSchema,
  resetar:        AcoesSalaSchema,
  removerJogador: AcoesSalaSchema,
  removerAdm:     AcoesSalaSchema,
  cartas: [CartaSchema]
});

module.exports = mongoose.model('Sala', SalaSchema)