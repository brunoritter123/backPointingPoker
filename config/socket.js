socketIo     = require('socket.io');
US           = require('../services/userService');
SalaSchema   = require('../models/salaSchema');
SalaService  = require('../services/salaService');
CartaSchema  = require('../models/cartaSchema');

module.exports = function (server) {
  let io = socketIo.listen(server);

  io.on('connection', (socket) => {

//---------
// DISCONNECT
//---------
    socket.on('disconnect', () => {
      console.log("disconnect")
      US.setOff(socket.id, (users, idSala) => {
        io.to(idSala).emit('get-user', {users: users, timeEnvio: new Date().getTime()});
      })
    });

//---------
// REMOVE
//---------
    socket.on('remove', (idSala, idUser, timeEnvio) => {
      console.log("remove")
      if (idSala !== undefined && idUser !== undefined) {
        US.remove(idSala, idUser, (users) => {
          io.to(idSala).emit('get-user', {users: users, timeEnvio: timeEnvio})
        })
      }
    });

//---------
// ADD-VOTO
//---------
    socket.on('add-voto', (idUser, carta, timeEnvio) => {
      console.log("add-voto")
      if (carta && idUser) {
        US.addVoto(idUser, carta, (users, idSala) => {
          io.to(idSala).emit('get-user', {users: users, timeEnvio: timeEnvio});
        })
      }
    });

    socket.on('send-sala', (idUser, userName, sala, timeEnvio) => {
      if (idUser !== undefined && sala !== undefined) {
        US.addVoto(idUser, carta, (users, idSala) => {
          io.to(idSala).emit('get-user', {users: users, timeEnvio: timeEnvio});
        })
      }
    });

//---------
// ADD-USER
//---------
    socket.on('add-user', (idSala, idUser, userName, isJogador, voto, timeEnvio) => {
      console.log("add-user")
      if (idSala !== undefined && idUser !== undefined && userName !== undefined && isJogador !== undefined) {
        socket.join(idSala);

        let usuario = {
          idUser: idUser,
          idSala: idSala.toUpperCase(),
          idSocket: socket.id,
          status: "ON",
          nome: userName,
          isJogador: isJogador?1:0
        };

        US.loginUser(usuario ,(docs) => {
          io.to(idSala).emit('get-user', {users: docs, timeEnvio: timeEnvio});
        })

        SalaService.loginUser(idSala, (sala) => {
          io.to(socket.id).emit('get-sala', sala);
         });
      }
    });

//-----------
// RESET
//-----------
  socket.on('reset', (idSala, timeEnvio) => {
    console.log("reset")
    if (idSala !== undefined) {
      US.reset(idSala, (users) => {
        io.to(idSala).emit('get-user', {users: users, timeEnvio: timeEnvio});
      });
    }
  });

//-----------
// UPDATE-SALA
//-----------
    socket.on('update-sala', (myId, userName, isUpdConfig, sala) => {
      console.log("update-sala")
      if (sala !== undefined) {
        SalaService.updateSala(sala, (doc) => {
          io.to(doc.idSala).emit('get-sala', doc, myId, userName, isUpdConfig);
        });
      }
    });
  });
}