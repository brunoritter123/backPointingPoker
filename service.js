'use strict';

let app = require('express')();
let http = require('http').Server(app);
let io = require('socket.io')(http);

let users = []

io.on('connection', (socket) => {

  socket.on('disconnect', () => {
    let user = io.get('nameUser');
    console.log('user disconnected: '+user);
    const newLocal = 'Bruno';

    users = users.filter(function(us) {
      console.log('filter: '+us.nome);
      return us.nome !== newLocal;
    });

    io.emit('get-user', users);
  });
  
  socket.on('add-voto', (voto) => {
    console.log(voto);
    io.emit('get-votos', {type:'new-message', text: voto});
  });

  socket.on('add-user', (user) => {
    users.push({nome: user, voto: null})
    io.set('nameUser', user)
    io.emit('get-user', users);
  });
});

http.listen(5000, () => {
  console.log('started on port 5000');
});