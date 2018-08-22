const mongodb = require('mongodb').MongoClient

module.exports = class UsersDAO {

  constructor() {
  }

  inserir(userConn) {
    mongodb.connect('mongodb://scrumpoker:Scrumpoker12@naboo.mongodb.umbler.com:35604/scrumpoker', {
      useNewUrlParser: true
    }, (err, db) => {
      if (err) throw err;
      var dbo = db.db('scrumpoker')
      dbo.collection("users").insertOne(userConn, function (err, res) {
        if (err) throw err;
        db.close();
      });
    });
  }

}
