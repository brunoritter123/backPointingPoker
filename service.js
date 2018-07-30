'use strict';
let app = require('express')();
let http = require('http').Server(app);
let io = require('socket.io')(http);

let users  = []
const cartas = [
  {value: 1 , label: '1'  , type: 'default'},
  {value: 2 , label: '2'  , type: 'default'},
  {value: 3 , label: '3'  , type: 'default'},
  {value: 5 , label: '5'  , type: 'default'},
  {value: 8 , label: '8'  , type: 'default'},
  {value: 13 , label: '13', type: 'default'},
  {value: 21 , label: '21', type: 'default'},
  {value: 54 , label: '54', type: 'default'},
  {value: undefined   , label: '?'},
]

io.on('connection', (socket) => {

  socket.on('disconnect', () => {
    users = users.filter(function(us) {
      return us.id !== socket.id;
    });
    io.emit('get-user', users);
  });
  
  socket.on('add-voto', (carta) => {
    users.forEach( (user) => {
      if(user.id == socket.id) {
        user.voto = carta;
      }
    });

    io.emit('get-user', users);
  });

  socket.on('add-user', (userName) => {
    users.push({id: socket.id, nome: userName, voto: {value: null, label: null, type: null}})
    io.emit('get-user', users);
  });

  socket.on('obs-cartas', () => {
    io.emit('get-cartas', cartas);
  });

});

http.listen(5000, () => {
  console.log('started on port 5000');
});