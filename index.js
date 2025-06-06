const express = require('express');
const http = require('http');
const { Server } = require('socket.io');
const cors = require('cors');
const PORT = process.env.PORT || 3000;
const app = express();
app.use(cors());

const server = http.createServer(app);
const io = new Server(server, {
  cors: {
    origin: '*',
    methods: ["GET", "POST"]
  },
});

io.on('connection', (socket) => {
  console.log('User connected:', socket.id);

  socket.on('join_room', ({ room, user }) => {
    socket.join(room);
    console.log(`${user} joined room ${room}`);
    socket.to(room).emit('user_joined', { user });
  });

  socket.on('send_message', ({ room, user, text }) => {
    io.to(room).emit('receive_message', { user, text });
  });
  
  socket.on('typing', ({ room, user }) => {
    socket.to(room).emit('user_typing', { user });
  });
  
  socket.on('disconnect', () => {
    console.log('User disconnected:', socket.id);
  }); 
});

server.listen(PORT, () => {
  console.log('Server running on '+PORT);
});