var app = require('express')();
var http = require('http').Server(app);
var io = require('socket.io')(http);

app.get('/', function(req, res){
  res.sendFile(__dirname + '/index.html');
});

app.get('/doc', function(req, res){
  res.sendFile(__dirname + '/doc.html');
});

io.on('connection', function(socket){
	console.log('a user got connected');
  socket.on('chat message', function(msg){
    console.log('i got the ', msg);
    io.emit('ping', 'right back at you');
  });
  socket.on('doc-change', function(deltas){
    user = deltas.user;
    delta = deltas.delta;
    oldDelta = deltas.old_delta;
    console.log('new');
    console.log(delta);
    console.log('old');
    io.emit('delta', {'user':user, 'data':delta});
  });
});
;

http.listen(3000, function(){
  console.log('listening on *:3000');
});
    
