var app = require('express')();
var http = require('http').Server(app);
var io = require('socket.io')(http);
var port = process.env.PORT || 3000;
const INDEX = '/index.html';

nicknames = [];

app.get('/', function(req, res){
  res.sendFile(__dirname + '/index.html');
});

io.on('connection', function(socket){
  socket.on('new_user', function (data, callback) {
    if (nicknames.indexOf(data) != -1) {
      console.log('hata');
      callback(false);
    }
    else {
      callback(true);
      socket.nickname = data;
      console.log('kaydedildi ' + socket.nickname);
      nicknames.push(socket.nickname);
      io.sockets.emit('usernames', nicknames);
      updateNicknames();
    }
  });

  socket.on('disconnect', function (data) {
    if (!socket.nickname) return;
    nicknames.splice(nicknames.indexOf(socket.nickname), 1);
    updateNicknames();
  });

  function updateNicknames() {
    io.sockets.emit('usernames', nicknames);
  }


  socket.on('tombala', function(msg){
    io.emit('tombala', msg);
  });
});

http.listen(port, function(){
  console.log('listening on *:' + port);
});
