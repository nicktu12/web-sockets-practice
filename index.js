var app = require('express')();
var http = require('http').Server(app);
var io = require('socket.io')(http);

app.get('/', function(req, res){
  res.sendFile(__dirname + `/index.html`);
});

io.on('connection', function(socket){
  const userId = Date.now();
  socket.broadcast.emit('chat message', `A new user, ${userId}, has joined the chat`, )
  // broadcast when user has joined or left chatroom
  socket.on('chat message', function(msg){
    io.emit('chat message', msg);
  });
  socket.on('disconnect', function(msg){
    io.emit('chat message', `User ${userId} disconnected`)
  });
  socket.on('typing', (user) => {
    io.emit('user typing', user);
  });
  // user is typing feature
  socket.on('empty', () => {
    io.emit('not typing')
  });
});

http.listen(3000, function(){
  console.log('listening on *:3000');
});
