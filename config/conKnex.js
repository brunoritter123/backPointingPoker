var knex = require('knex')({
    client: 'sqlite3',
    connection: {
      filename: "./dataBase.sqlite3"
    },
    useNullAsDefault: true
  });

module.exports = knex