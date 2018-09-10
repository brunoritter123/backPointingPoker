const server = require('./config/server')
const mongoose = require('./config/database')
require('./config/socket')(server)