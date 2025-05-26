const express = require('express');
const session = require('express-session');
const http = require('http');
const { Server } = require('socket.io');

const LOGIN_USER = 'admin';
const LOGIN_PASS = 'secret';

const app = express();
const server = http.createServer(app);
const io = new Server(server);

app.use(session({
  secret: 'change_this_secret',
  resave: false,
  saveUninitialized: true,
}));

app.use(express.static('public'));

app.get('/control.html', (req, res) => {
  res.sendFile(__dirname + '/public/control.html');
});
app.get('/listener.html', (req, res) => {
  res.sendFile(__dirname + '/public/listener.html');
});

io.on('connection', (socket) => {
  console.log('Client connected:', socket.id);

  socket.on('command', (cmd) => {
    console.log('Command from control panel:', cmd);
    io.emit('command', cmd);
  });

  socket.on('volume', (data) => {
    console.log('Volume set to:', data.volume);
    io.emit('volume', data);
  });

  socket.on('disconnect', () => {
    console.log('Client disconnected:', socket.id);
  });
});

const PORT = process.env.PORT || 3000;
server.listen(PORT, () => {
  console.log(`Server listening on port ${PORT}`);
});