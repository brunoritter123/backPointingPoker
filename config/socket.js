socketIo     = require('socket.io');
UserSchema   = require('../models/userSchemas');
US           = require('../models/userService');

module.exports = function (server) {
  let io      = socketIo.listen(server);

  let users = []
  const votoNull = {
    value: 0,
    label: '',
    type: ''
  };
  const cartas = [{
      value: 1,
      label: '1',
      type: 'default'
    },
    {
      value: 2,
      label: '2',
      type: 'default'
    },
    {
      value: 3,
      label: '3',
      type: 'default'
    },
    {
      value: 5,
      label: '5',
      type: 'default'
    },
    {
      value: 8,
      label: '8',
      type: 'default'
    },
    {
      value: 13,
      label: '13',
      type: 'default'
    },
    {
      value: 21,
      label: '21',
      type: 'default'
    },
    {
      value: 54,
      label: '54',
      type: 'default'
    },
    {
      value: undefined,
      label: '?'
    },
  ]

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
      US.remove(idSala, idUser, () => {
        io.to(idSala).emit('get-user', users)
      })
    });

//---------
// ADD-VOTO
//---------
    socket.on('add-voto', (idUser, carta) => {
      US.addVoto(idUser, carta, (users, idSala) => {
        io.to(idSala).emit('get-user', users);
      })
    });

//---------
// ADD-USER
//---------
    socket.on('add-user', (idSala, idUser, userName, isJogador) => {
      socket.join(idSala);

      let usuario = new UserSchema({
        idUser: idUser,
        idSala: idSala.toUpperCase(),
        idSocket: socket.id,
        status: "ON",
        nome: userName,
        isJogador: isJogador,
        voto: votoNull
      });

      US.newUser(usuario ,(docs) => {
        io.to(idSala).emit('get-user', docs);
      })
    });

//-----------
// OBS-CARTAS
//-----------
  socket.on('obs-cartas', (idSala) => {
    socket.join(idSala);
    io.to(idSala).emit('get-cartas', cartas);
  });

//-----------
// RESET
//-----------
  socket.on('reset', (idSala) => {
    US.reset(idSala, (users) => {
      io.to(idSala).emit('get-user', users);
      io.to(idSala).emit('get-FimJogo', false)
    })
  });

//-----------
// fimJogo
//-----------
    socket.on('fimJogo', (idSala) => {
      io.to(idSala).emit('get-FimJogo', true)
    });
  });
}