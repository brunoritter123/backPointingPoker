socketIo     = require('socket.io');
userServ     = require('../services/userService');
salaServ     = require('../services/salaService');

module.exports = function (server, knex) {
  const US = new userServ(knex)
  const SalaService  = new salaServ(knex)

  let io = socketIo.listen(server);

  io.on('connection', (socket) => {

//---------
// DISCONNECT
//---------
    socket.on('disconnect', () => {
      US.setOff(socket.id, (users, idSala) => {
        io.to(idSala).emit('get-user', {users: users, timeEnvio: new Date().getTime()});
      })
    });

//---------
// REMOVE
//---------
    socket.on('remove', (idSala, idUser, timeEnvio) => {
      if (idSala !== undefined && idUser !== undefined) {
        US.remove(idSala, idUser, (users) => {
          io.to(idSala).emit('get-user', {users: users, timeEnvio: timeEnvio})
        })
      }
    });

//---------
// ADD-VOTO
//---------
    socket.on('add-voto', (idUser, carta, idSala, timeEnvio) => {
      if (!!idUser) {
        US.addVoto(idUser, carta, idSala, (users) => {
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

        SalaService.loginUser(idSala, (sala) => {
          US.loginUser(usuario ,(docs) => {
            io.to(socket.id).emit('get-sala', {sala: sala, nmHistoria: undefined});
            io.to(idSala).emit('get-user', {users: docs, timeEnvio: timeEnvio});
          })
         });
      }
    });

//-----------
// RESET
//-----------
  socket.on('reset', (idSala, timeEnvio) => {
    if (idSala !== undefined) {
      US.reset(idSala, (users) => {
        io.to(idSala).emit('get-user', {users: users, timeEnvio: timeEnvio});
      });
    }
  });

//-----------
// UPDATE-SALA
//-----------
    socket.on('update-sala', (myId, userName, isUpdConfig, sala, timeEnvio) => {
      if (sala !== undefined) {
        SalaService.updateSala(sala, isUpdConfig, (doc) => {
          if (isUpdConfig) {
            US.reset(doc.idSala, (users) => {
              io.to(doc.idSala).emit('get-user', {users: users, timeEnvio: timeEnvio});
            });
          }
          io.to(doc.idSala).emit('get-sala', {sala: doc, nmHistoria: undefined});
        });
      }
    });

    //-----------
    // concluir
    //-----------
    socket.on('concluir', (idSala, carta, timeEnvio) => {
      if (!!carta && !!carta.nmUltHist) {
        SalaService.updateCarta(carta)
        SalaService.updateHistoria(idSala, "")

        io.to(idSala).emit('get-carta', {carta: carta, timeEnvio: timeEnvio});
      }
    });

    //-----------
    // Update-Historia
    //-----------
    socket.on('update-historia', (idSala, nmHistoria, timeEnvio) => {
      if (!!nmHistoria) {
        SalaService.updateHistoria(idSala, nmHistoria)
        io.to(idSala).emit('get-sala', {sala: undefined, nmHistoria: nmHistoria});
      }
    });

  });
}