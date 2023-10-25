const http = require('http');
const express = require('express');
const { Server } = require('socket.io');

const app = express();
const server = http.createServer(app);
const io = new Server(server);

const port = process.env.PORT || 3000; // Define the port for your server

const players = [];

const generateRandomPosition = () => {
  return [Math.random() * 3, 0, Math.random() * 3];
};

app.get('/', (req, res) => {
  res.send('Socket.io server is running.');
});

io.on('connection', (socket) => {
  console.log('A user connected');

  players.push({
    id: socket.id,
    position: generateRandomPosition(),
  });

  io.emit('players', players);

  // Handle custom events
  socket.on('custom-event', (data) => {
    console.log('Received custom data:', data);
    // Broadcast the data to all connected clients
    io.emit('custom-event', data);
  });

  socket.on('move', ({ position }) => {
    const player = players.find((player) => player.id === socket.id);
    console.log(player);
    player.position = position;
    io.emit('players', players);
  });

  socket.on('disconnect', () => {
    console.log('A user disconnected');
    players.splice(
      players.findIndex((player) => player.id === socket.id),
      1
    );
    io.emit('players', players);
  });
});

server.listen(port, () => {
  console.log(`Socket.io server is running on port ${port}`);
});
