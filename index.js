const express = require("express");
const socketio = require("socket.io");
const http = require("http");
const cors = require("cors");

const app = express();
const server = http.createServer(app);
const io = socketio(server);

const {
  addAvatar,
  removeAvatar,
  getAvatar,
  getAvatars,
} = require("./avatars.js");

const PORT = process.env.PORT || 5000;

app.use(cors());

app.get("/", (req, res) => {
  res.send("server is up and running");
});

io.on("connection", (socket) => {
  console.log("connected");

  socket.on("join", ({ name, color, x, y }) => {
    addAvatar({ id: socket.id, name, color, x, y });

    console.log(name + " has joined");
    io.emit("floorData", { avatars: getAvatars() });
  });

  socket.on("update", ({ name, color, x, y }) => {
    removeAvatar(socket.id);
    addAvatar({ id: socket.id, name, color, x, y });
    io.emit("floorData", { avatars: getAvatars() });
  });

  socket.on("disconnect", () => {
    removeAvatar(socket.id);

    console.log("disconnected");
    io.emit("floorData", { avatars: getAvatars() });
  });
});

server.listen(PORT, () => console.log("server has started on port " + PORT));
