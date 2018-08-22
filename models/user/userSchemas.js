const mongoose = require('../../config/database')

const userSchema = new mongoose.Schema({
  id: String,
  idSala: String,
  status: String,
  nome: String,
  isJogador: String,
  voto: {
    value: number,
    label: String,
    type: String
  }
});

module.exports = restful.model('User', userSchema)