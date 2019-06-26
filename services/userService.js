
UserSchema = require('../models/userSchema');

module.exports = class UserService {


  static async loginUser (usuario, callback) {

    await UserSchema.find({ idUser: usuario.idUser }, function (err, docs) {
      if (err) return console.error(err);

      if (docs === null || docs === undefined || docs.length === 0) {
        UserService.saveUser(usuario, callback);

      } else if (docs.length === 1) {

        const doc = docs[0];

        doc.idUser    = usuario.idUser    ;
        doc.idSala    = usuario.idSala    ;
        doc.idSocket  = usuario.idSocket  ;
        doc.status    = usuario.status    ;
        doc.nome      = usuario.nome      ;
        doc.isJogador = usuario.isJogador ;

        UserService.saveUser(doc, callback);

      } else {
        UserSchema.deleteMany({ idUser: usuario.idUser }, function (err) {
          if (err) return console.error(err);

          UserService.saveUser(usuario, callback)
        });
      }

    }).catch(e => console.error("Erro no find2: "+e));
  }


  static async saveUser(usuario, callback) {
    usuario.save((err) => {
      if (err) return console.error(err);

      UserSchema.find({ idSala: usuario.idSala }, function (err, docs) {
        if (err) return console.error(err);
    
        callback(docs);
      }).catch(e => console.error("Erro no find3: "+e));
    });
  }

  static async remove (idSala, idUser, callback) {

    await UserSchema.deleteMany({ idUser: idUser }, function (err) {
      if (err) return console.error(err);

      UserSchema.find({ idSala: idSala }, function (err, docs) {
        if (err) return console.error(err);
    
        callback(docs);
      }).catch(e => console.error("Erro no find4: "+e));
    });
  }

  static async addVoto (idUser, voto, callback) {

    await UserSchema.findOne({ idUser: idUser }, function (err, doc) {
      if (err) return console.error(err);

      if (doc !== null) {
        doc.voto = {id    : voto.id,
                    value : voto.value,
                    label : voto.label,
                    type  : voto.type}

        doc.save((err) => {
          if (err) return console.error(err);

          UserSchema.find({ idSala: doc.idSala }, function (err, docs) {
            if (err) return console.error(err);
        
            callback(docs, doc.idSala);
          }).catch(e => console.error("Erro no find5: "+e));
        });
      }
    }).catch(e => console.error("Erro no findOne2: "+e));
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
          }).catch(e => console.error("Erro no find6: "+e));
        });
      }
    }).catch(e => console.error("Erro no findOne3: "+e));
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
        }).catch(e => console.error("Erro no find7: "+e));
      });
  }
}
