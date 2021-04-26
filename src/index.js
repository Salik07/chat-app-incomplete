const path = require("path");
const http = require("http");
const express = require("express");
const socketio = require("socket.io");

const app = express();
const server = http.createServer(app);
const io = socketio(server);

const port = process.env.PORT || 3000;
const publicDirectoryPath = path.join(__dirname, "../public");

app.use(express.static(publicDirectoryPath));

const typers = {};

io.on("connection", (socket) => {
  console.log("New WebSocket Connection.");

  socket.emit("message", "Welcome!");
  socket.broadcast.emit("message", "A new user has joined!");

  socket.on("typing", (data) => {
    typers[socket.id] = 1;

    console.log("typers--", typers);

    socket.broadcast.emit("typing", {
      ...data,
      typers: Object.keys(typers).length,
    });
  });

  socket.on("sendMessage", (message) => {
    delete typers[socket.id];
    console.log("obj", typers);
    io.emit("message", {
      message,
      typers: Object.keys(typers).length,
    });
  });

  socket.on("disconnect", () => {
    io.emit("message", "A user has left!");
  });
});

server.listen(port, () => {
  console.log(`Server is up on port ${port}!`);
});
