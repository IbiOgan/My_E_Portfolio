const express = require('express');
const socket = require('socket.io');

// App setup
const app = express();
const port = 5000;
const server = app.listen(port, () => {
  console.log(`App is listening on port ${port}`);
});

app.use(express.json());

// Static files
app.use(express.static('public'));

// app.get('/', (req, res) => {
//   res.status(200).send('Hello from the Server');
// });

//routes
app.get('/api/v1', (req, res) => {
  res.status(200).send('Hello from the Server');
});

app.post('/api/v1', (req, res) => {
  res.status(200).send('Hello from the Server');
});

// Socket setup
const io = socket(server);
const users = {};
const activeUsers = new Set();

io.on('connection', (socket) => {
  console.log('Made Socket Connection');
  socket.on('new-user', (name) => {
    if (activeUsers.has(name)) {
      name = `User${Math.floor(Math.random() * 1000 + 11)}`;
    }
    activeUsers.add(name);
    users[socket.id] = name;
    io.emit('update list', [...activeUsers]);
    socket.broadcast.emit('user-connected', name);
  });
  socket.on('send-message', (message) => {
    socket.broadcast.emit('chat-message', {
      message: message,
      name: users[socket.id],
    });
  });

  socket.on('disconnect', () => {
    let name = users[socket.id];
    activeUsers.delete(name);
    socket.broadcast.emit('user-disconnected', {
      name: name,
      users: [...activeUsers],
    });
    delete users[socket.id];
  });
});
