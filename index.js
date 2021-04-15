const express = require("express");
const socketio = require("socket.io");
const http = require("http");
const cors = require("cors");

const app = express();
const server = http.createServer(app);
const io = socketio(server);

// functions for managing avatars
const {
  addAvatar,
  removeAvatar,
  getAvatar,
  getAvatars,
  updateAvatar,
} = require("./avatars.js");

const PORT = process.env.PORT || 5000;
app.use(cors());
app.get("/", (req, res) => {
  res.send("server is up and running");
});

// client connects
io.on("connection", (socket) => {
  // Avatar joined the floor
  socket.on("join", ({ name, color, x, y }) => {
    // add new Avatar in Avatar List
    addAvatar({ id: socket.id, name, color, x, y });
    console.log(name + " has joined");
    // respond Full Avatar List to client
    io.emit("floorData", { avatars: getAvatars() });

    // remove If when test removed

    console.log("users connected: ", getAvatars().length);
  });

  // Update position on client avatar
  socket.on("update", ({ x, y }) => {
    if (getAvatar(socket.id)) {
      // updates Avatar in List
      updateAvatar(socket.id, x, y);
      //responds to client with updated avatar list
      io.emit("floorData", { avatars: getAvatars() });
    }
  });

  // user Disconnects
  socket.on("disconnect", () => {
    if (getAvatar(socket.id)) {
      console.log(getAvatar(socket.id).name + " disconnected");

      //remove Avatar from avatar list
      removeAvatar(socket.id);

      //respond entire avatarlist to clients
      io.emit("floorData", { avatars: getAvatars() });

      console.log("users connected: ", getAvatars().length);
    }
  });
});

server.listen(PORT, () => console.log("server has started on port " + PORT));
