socketIo     = require('socket.io');
UserSchema   = require('../models/userSchemas');
US           = require('../models/userService');

module.exports = function (server) {
  let io = socketIo.listen(server);

  const cartas = [{id: 1, value: 1, label: '1', type: 'default' },
    {id: 2, value: 2, label: '2', type: 'default' },
    {id: 3, value: 3, label: '3', type: 'default' },
    {id: 4, value: 5, label: '5', type: 'default' },
    {id: 5, value: 8, label: '8', type: 'default' },
    {id: 6, value: 13, label: '13', type: 'default' },
    {id: 7, value: 21, label: '21', type: 'default' },
    {id: 8, value: 54, label: '54', type: 'default' },
    {id: 9, value: undefined, label: '?' }]

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
    socket.on('add-user', (idSala, idUser, userName, isJogador) => {
      if (idSala !== undefined && idUser !== undefined && userName !== undefined && isJogador !== undefined) {
        socket.join(idSala);

        let usuario = new UserSchema({
          idUser: idUser,
          idSala: idSala.toUpperCase(),
          idSocket: socket.id,
          status: "ON",
          nome: userName,
          isJogador: isJogador,
          voto: {id: undefined,
                value: undefined,
                label: '',
                type: ''}
        });

        US.newUser(usuario ,(docs) => {
          io.to(idSala).emit('get-user', docs);
        })
      }
    });

//-----------
// OBS-CARTAS
//-----------
  socket.on('obs-cartas', (idSala) => {
    if (idSala !== undefined) {
      socket.join(idSala);
      io.to(idSala).emit('get-cartas', cartas);
    }
  });

//-----------
// RESET
//-----------
  socket.on('reset', (idSala) => {
    if (idSala !== undefined) {
      US.reset(idSala, (users) => {
        io.to(idSala).emit('get-user', users);
        io.to(idSala).emit('get-FimJogo', false)
      })
    }
  });

//-----------
// fimJogo
//-----------
    socket.on('fimJogo', (idSala) => {
      if (idSala !== undefined) {
        io.to(idSala).emit('get-FimJogo', true)
      }
    });

  });
}