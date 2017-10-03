var app = require('express')();
var http = require('http').Server(app);
var io = require('socket.io')(http);

var curDelta = null;
var numberOfUsers = 0;
var newConnectionQueue = [];

app.get('/', function(req, res){
  res.sendFile(__dirname + '/index.html');
});

app.get('/doc', function(req, res){
  res.sendFile(__dirname + '/doc.html');
});

io.on('connection', function(socket){
	console.log('a user got connected');
  
  socket.on('doc-change', function(deltas){
    user = deltas.user;
    delta = deltas.delta;
    oldDelta = deltas.old_delta;
    console.log('new');
    console.log(delta);
    console.log('old');
    io.emit('delta', {'user':user, 'data':delta});
  });


  socket.on('load-get', function(delta){
    console.log('got the sync data');
    curDelta = delta;
    var size = newConnectionQueue.length;
    console.log('updating ' + size + ' sockets');
    for(var i=0; i < size; i+=1){ // consume all waiting new clients
      var clientSocket = newConnectionQueue.shift();
      clientSocket.emit('connection', delta); 
    }
  });

  if(curDelta != null || numberOfUsers != 0){
    console.log('sync new user');
    io.sockets.emit('get', '');
    newConnectionQueue.push(socket);
  //  socket.emit('connection', curDelta);
  //  io.sockets.emit('connection', curDelta);
  }else if(numberOfUsers == 0){
    console.log('first user');
    io.sockets.emit('first-connection', '');
    numberOfUsers += 1;
  }
});




http.listen(3000, function(){
  console.log('listening on *:3000');
});
    
