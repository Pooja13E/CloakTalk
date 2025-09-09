const express = require("express");
const http = require("http");
const { Server } = require("socket.io");
const cors = require("cors");
const { v4: uuidv4 } = require("uuid");

const app = express();
app.use(cors());

const server = http.createServer(app);
const io = new Server(server, {
  cors: {
    origin: "*",
  },
});

app.get("/", (req, res) => {
  res.send("Server is running!");
});

io.on("connection", (socket) => {
  console.log("New user connected");
  socket.currentRoom = null;

  // Set username
  socket.on("setUsername", (username) => {
    socket.username = username;
  });

  // Join room
  socket.on("joinRoom", (roomName) => {
    if (socket.currentRoom) {
      socket.leave(socket.currentRoom);
    }

    socket.join(roomName);
    socket.currentRoom = roomName;
    console.log(`${socket.username} joined room ${roomName}`);

    io.to(roomName).emit("systemMessage", {
      id: uuidv4(),
      message: `🔵 ${socket.username} joined the room`,
      timestamp: Date.now(),
      username: "System",
      sensitivity: "low"
    });
  });

  // Leave room
  socket.on("leaveRoom", () => {
    if (socket.currentRoom) {
      const roomName = socket.currentRoom;
      socket.leave(roomName);

      io.to(roomName).emit("systemMessage", {
        id: uuidv4(),
        message: `🔴 ${socket.username} left the room`,
        timestamp: Date.now(),
        username: "System",
        sensitivity: "low"
      });

      socket.currentRoom = null;
      console.log(`${socket.username} left ${roomName}`);
    }
  });

  // Typing indicator
  socket.on("typing", () => {
    if (socket.currentRoom) {
      socket.to(socket.currentRoom).emit("typing", { username: socket.username });
    }
  });

  socket.on("stopTyping", () => {
    if (socket.currentRoom) {
      socket.to(socket.currentRoom).emit("stopTyping", { username: socket.username });
    }
  });

  // Receive encrypted message + sensitivity
  socket.on("chatMessage", (data) => {
    const sensitivity = data.sensitivity || "low";

    const payload = {
      id: uuidv4(),
      ...data,
      sensitivity,
      timestamp: Date.now(),
    };

    if (socket.currentRoom) {
      io.to(socket.currentRoom).emit("chatMessage", payload);

      if (sensitivity !== "low") {
        const timeout = sensitivity === "high" ? 30000 : 60000;
        setTimeout(() => {
          io.to(socket.currentRoom).emit("deleteMessage", { id: payload.id });
        }, timeout);
      }
    }
  });

  socket.on("disconnect", () => {
    console.log("User disconnected");
  });
});

server.listen(4000, () => {
  console.log("Server running on http://localhost:4000");
});
