const router = require("express").Router();
const express = require("express");
const ChatClient = require("../models/Chat")
const http = require('http');

const { Server: SocketServer } = require('socket.io');

const app = express()
const server = http.createServer(app);
const io = new SocketServer(server, {
  cors: {
    origin: '*',
  },
});

io.on("connection", (socket) => {
  console.log("A chat participant connected:", socket.id);

  socket.on("msg:typing", (typingData) => {
    const { sender, state } = typingData;
    // console.log(`${sender} is ${state ? "typing..." : "stopped typing."}`);

    socket.broadcast.emit("msg:typing", { sender, state });
  });


  socket.on('msg:send', async (msg) => {
    try {
      // const response_add_message = await ChatClient.create(msg);
      // io.emit('msg:receive', response_add_message);
      io.emit('msg:receive', msg);
    } catch (error) {
      console.error('Failed to save message:', error);

      socket.emit('msg:error', { message: 'Failed to send message', error });
    }
  });

  socket.on("disconnect", () => {
    console.log("A chat participant disconnected:", socket.id);
  });
});

const PORT = 9001;
server.listen(PORT, () => {
  console.log(`Socket Server is running on http://localhost:${PORT}`);
});



module.exports = router