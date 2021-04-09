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

// test number for /test
let testNumber = 0;

// client connects
io.on("connection", (socket) => {
  console.log(" user connected");

  // initial response for test
  io.emit("mutated", testNumber);

  // increase function for test
  socket.on("mutate", (number) => {
    testNumber = testNumber + number;
    console.log(testNumber);
    io.emit("mutated", testNumber);
  });

  // Avatar joined the floor
  socket.on("join", ({ name, color, x, y }) => {
    // add new Avatar in Avatar List
    addAvatar({ id: socket.id, name, color, x, y });
    console.log(name + " has joined");
    // respond Full Avatar List to client
    io.emit("floorData", { avatars: getAvatars() });
  });

  // Update position on client avatar
  socket.on("update", ({ x, y }) => {
    // updates Avatar in List
    updateAvatar(socket.id, x, y);
    // responds to clients with updated client positions
    io.emit("updateFloor", { updatedAvatar: getAvatar(socket.id) });
  });

  // user Disconnects
  socket.on("disconnect", () => {
    //remove Avatar from avatar list
    removeAvatar(socket.id);

    console.log("disconnected");

    //respond entire avatarlist to clients
    io.emit("floorData", { avatars: getAvatars() });
  });
});

server.listen(PORT, () => console.log("server has started on port " + PORT));
