SalaSchema = require('../models/salaSchema');

const padraoCartas = [{id: 1, value: 1, label: '1', type: 'default' },
{id: 2, value: 2, label: '2', type: 'default' },
{id: 3, value: 3, label: '3', type: 'default' },
{id: 4, value: 5, label: '5', type: 'default' },
{id: 5, value: 8, label: '8', type: 'default' },
{id: 6, value: 13, label: '13', type: 'default' },
{id: 7, value: 21, label: '21', type: 'default' },
{id: 8, value: 34, label: '34', type: 'default' },
{id: 9, value: 55, label: '55', type: 'default' },
{id: 10, value: undefined, label: '?' }]

module.exports = class SalaService {

  static async loginUser (idSala, callback) {

    await SalaSchema.find({ idSala: idSala }, function (err, docs) {
      if (err) return console.error(err);

      if (docs === null || docs === undefined || docs.length === 0) {
        const sala = new SalaSchema({
                    idSala: idSala,
                    cartas: padraoCartas, 
                    forceFimJogo: false});

        SalaService.saveSala(sala, callback);

      } else if (docs.length === 1) {
        
        SalaService.getSala(docs[0].idSala, callback)

      } else {
        SalaSchema.deleteMany({ idSala: idSala }, function (err) {
          if (err) return console.error(err);

          const sala = new SalaSchema({
                      idSala: idSala,
                      cartas: padraoCartas,
                      forceFimJogo: false });
          SalaService.saveSala(sala, callback);
        });
      }

    });
  }

  static async saveSala(sala, callback) {
    sala.save((err) => {
      if (err) return console.error(err);

      SalaService.getSala(sala.idSala, callback)
    });
  }

  static async updateSala(sala, callback) {
    SalaSchema.update({ _id: sala._id }, { $set: { 
      idSala: sala.idSala,
      forceFimJogo: sala.forceFimJogo,
      cartas: sala.cartas
     }}, function() {SalaService.getSala(sala.idSala, callback)});
  }

  static async getSala(idSala, callback) {
    SalaSchema.findOne({ idSala: idSala }, function (err, doc) {
      if (err) return console.error(err);
  
      callback(doc);
    });
  }

}