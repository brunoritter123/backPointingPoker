knex = require('knex');

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

module.exports = knex(con_string)
