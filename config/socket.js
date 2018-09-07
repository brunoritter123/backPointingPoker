socketIo     = require('socket.io');
UserSchema   = require('../models/userSchema');
US           = require('../services/userService');
SalaSchema   = require('../models/salaSchema');
SalaService  = require('../services/salaService');
CartaSchema  = require('../models/cartaSchema')

module.exports = function (server) {
  let io = socketIo.listen(server);

  io.on('connection', (socket) => {

//---------
// DISCONNECT
//---------
    socket.on('disconnect', () => {
      US.setOff(socket.id, (users, idSala) => {
        io.to(idSala).emit('get-user', users);
      })
    });

//---------
// REMOVE
//---------
    socket.on('remove', (idSala, idUser) => {
      if (idSala !== undefined && idUser !== undefined) {
        US.remove(idSala, idUser, (users) => {
          io.to(idSala).emit('get-user', users)
        })
      }
    });

//---------
// ADD-VOTO
//---------
    socket.on('add-voto', (idUser, carta) => {
      if (carta !== undefined && idUser !== undefined) {
        US.addVoto(idUser, carta, (users, idSala) => {
          io.to(idSala).emit('get-user', users);
        })
      }
    });

//---------
// ADD-USER
//---------
    socket.on('add-user', (idSala, idUser, userName, isJogador, voto) => {
      if (idSala !== undefined && idUser !== undefined && userName !== undefined && isJogador !== undefined) {
        socket.join(idSala);

        let usuario = new UserSchema({
          idUser: idUser,
          idSala: idSala.toUpperCase(),
          idSocket: socket.id,
          status: "ON",
          nome: userName,
          isJogador: isJogador,
          voto: voto
        });

        US.loginUser(usuario ,(docs) => {
          io.to(idSala).emit('get-user', docs);
        })

        SalaService.loginUser(idSala, (sala) => {
          io.to(socket.id).emit('get-sala', sala);
         });
      }
    });

//-----------
// RESET
//-----------
  socket.on('reset', (idSala) => {
    if (idSala !== undefined) {
      US.reset(idSala, (users) => {
        io.to(idSala).emit('get-user', users);
      });
    }
  });

//-----------
// UPDATE-SALA
//-----------
    socket.on('update-sala', (sala) => {
      if (sala !== undefined) {
        SalaService.updateSala(sala, (doc) => {
          console.log(doc.idSala);
          io.to(doc.idSala).emit('get-sala', doc);
        });
      }
    });

  });
}