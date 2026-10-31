js
const express = require('express');
const http = require('http');
const { Server } = require('socket.io');

const app = express();
app.use(express.static('public'));
const server = http.createServer(app);
const io = new Server(server);

io.on('connection', (socket) => {
  socket.on('join', (room) => {
    socket.join(room);
    socket.data.room = room;
    socket.to(room).emit('user-joined', socket.id);
  });

  socket.on('signal', ({ to, data }) => {
    io.to(to).emit('signal', { from: socket.id, data });
  });

  socket.on('disconnect', () => {
    if (socket.data.room) {
      socket.to(socket.data.room).emit('user-left', socket.id);
    }
  });
});

const PORT = process.env.PORT || 3000;
server.listen(PORT, () => console.log('Running on port ' + PORT));
```
