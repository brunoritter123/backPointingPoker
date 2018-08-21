const mongodb = require('mongodb')

const connMongoDb = function() {
  return mongodb.connect('mongodb://scrumpoker:Scrumpoker12@naboo.mongodb.umbler.com:35604/scrumpoker', { useNewUrlParser: true });
}

module.exports = connMongoDb;

