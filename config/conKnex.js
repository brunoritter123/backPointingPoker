knex = require('knex');

function createConnection() {
  var con_string = process.env.scrumpoker_connection_string

  if (!con_string) {
    con_string = {
      client: 'sqlite3',
      connection: {
        filename: "./dataBase.sqlite3"
      },
      useNullAsDefault: true,
      pool: { min: 0, max: 1 }
    }
  } else {
    con_string = JSON.parse(con_string)
  }
}

let tentativas = 5;
while (tentativas) {
  try {
    createConnection();
    break;
  } catch (error) {
    tentativas -= 1;
    console.log(`Tentativas para conectar: ${tentativas}`);

    // Aguardar 5 segundos para tentar conectar novamente
    await new Promise(res => setTimeOut(res, 5000));
  }
}


module.exports = knex(con_string)
