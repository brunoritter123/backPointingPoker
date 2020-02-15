knex = require('knex');
defConString = require('./conn-database.json')

function concetar() {
  let tentativas = 5;
  let conneccao;

  while (tentativas) {
    try {
      conneccao = knex(defConString);
      return conneccao

    } catch (error) {
      tentativas -= 1;
      console.log(`Tentativas para conectar: ${tentativas}`);
    }
  }
}

module.exports = concetar()
