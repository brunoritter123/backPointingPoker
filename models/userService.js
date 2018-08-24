
UserSchema = require('./userSchemas');

module.exports = class UserService {


  static async newUser (usuario, callback) {

    await UserSchema.deleteMany({ idUser: usuario.idUser }, function (err) {
      if (err) return console.error(err);
    });

    await usuario.save((err) => {
      if (err) return console.error(err);

      UserSchema.find({ idSala: usuario.idSala }, function (err, docs) {
        if (err) return console.error(err);
    
        callback(docs);
      });
    });
  }


  static async remove (idSala, idUser, callback) {

    await UserSchema.deleteMany({ idUser: idUser }, function (err) {
      if (err) return console.error(err);

      UserSchema.find({ idSala: idSala }, function (err, docs) {
        if (err) return console.error(err);
    
        callback(docs);
      });
    });
  }

  static async addVoto (idUser, voto, callback) {

    await UserSchema.findOne({ idUser: idUser }, function (err, doc) {
      if (err) return console.error(err);

      doc.voto.id    = voto.id
      doc.voto.value = voto.value;
      doc.voto.label = voto.label;
      doc.voto.type  = voto.type;

      doc.save((err) => {
        if (err) return console.error(err);

        UserSchema.find({ idSala: doc.idSala }, function (err, docs) {
          if (err) return console.error(err);
      
          callback(docs, doc.idSala);
        });
      });
    });
  }

  static async setOff (idSocket, callback) {

    await UserSchema.findOne({ idSocket: idSocket }, function (err, doc) {
      if (err) return console.error(err);
      if (doc !== null) {
        doc.status = 'OFF'
        doc.save((err) => {
          if (err) return console.error(err);

          UserSchema.find({ idSala: doc.idSala }, function (err, docs) {
            if (err) return console.error(err);
        
            callback(docs, doc.idSala);
          });
        });
      }
    });
  }

  static async reset (idSala, callback) {
    let votoNull = {id: undefined, value: undefined, label: '', type: ''}

    await UserSchema.updateMany(
      {idSala: idSala},
      {voto: votoNull},
       () => {
        UserSchema.find({ idSala: idSala }, function (err, docs) {
          if (err) return console.error(err);
          callback(docs);
        });
      });
  }
}
