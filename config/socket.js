socketIo     = require('socket.io');
connection   = require('./database');
UsersDAO     = require('../models/UsersDAO');

module.exports = function (server) {
  let io      = socketIo.listen(server);
  let userDAO =  new UsersDAO(connection);

  let users = []
  const votoNull = {
    value: null,
    label: null,
    type: null
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

    socket.on('disconnect', () => {
      let remover = false;
      users.forEach(function (us) {
        if (us.id == socket.id) {
          if (us.voto.value === null || us.voto.value === undefined) {
            remover = true;
          } else {
            us.status = "OFF"
          }
        }
      });

      if (remover) {
        users = users.filter(function (us) {
          return us.id !== socket.id;
        });
      }

      io.emit('get-user', users);
    });

    socket.on('remove', () => {
      users = users.filter(function (us) {
        return us.id !== socket.id;
      });
      io.emit('get-user', users);
    });

    socket.on('add-voto', (carta) => {
      let acabouJogo = true;
      users.forEach((user) => {
        if (user.id == socket.id) {
          user.voto = carta;
        }
        if (user.isJogador && !user.voto.label) {
          acabouJogo = false;
        }
      });

      io.emit('get-user', users);
      if (acabouJogo) {
        io.emit('get-FimJogo', true);
      }
    });

    socket.on('add-user', (userName, isJogador, oldId) => {
      let achou = false;

      if (oldId !== undefined) {
        users.forEach(function (us) {
          if (us.id == oldId) {

            us.id = socket.id
            us.nome = userName;
            us.isJogador = isJogador;
            us.status = "ON";
            achou = true;
          }
        });
      }

      if (!achou) {
        users.push({
          id: socket.id,
          status: "ON",
          nome: userName,
          isJogador: isJogador,
          voto: votoNull
        });
      }

      var us = {
        id: socket.id,
        status: "ON",
        nome: userName,
        isJogador: isJogador,
        voto: votoNull
      }
      console.log(userDAO);
      userDAO.inserir(us);

      io.emit('get-user', users);
    });

    socket.on('obs-cartas', () => {
      io.emit('get-cartas', cartas);
    });

    socket.on('add-FimJogo', (fimJogo) => {
      io.emit('get-FimJogo', fimJogo);
      if (!fimJogo) {
        let retUsers = [];
        users.forEach((user) => {
          user.voto = votoNull
          if (user.status === 'ON') {
            retUsers.push(user);
          }
        });
        users = retUsers;
        io.emit('get-user', users);
      }
    });

  });
}