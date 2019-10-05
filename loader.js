const knex   = require('./config/conKnex')
const server = require('./config/server')
require('./config/database')(knex)
require('./config/socket')(server, knex)