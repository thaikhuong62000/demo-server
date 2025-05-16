import express from "express";
import { createServer } from "node:http";
import { join } from "node:path";
import { Server } from "socket.io";

const app = express();
const server = createServer(app);
const io = new Server(server, {
  cors: {
    origin: "*",
  },
});

app.get("/", (req, res) => {
  res.sendFile(join(__dirname, "../", "index.html"));
});

io.on("connection", (socket) => {
  socket.on("join", async ({ id }) => {
    console.log("Join", id);
    socket.join(`${id}`);
  });

  socket.on("chat", async ({ id, message }) => {
    console.log("Chat", id, message);
    socket.to(`${id}`).emit("chat", message);
  });

  socket.on("invite", async ({ id, message }) => {
    console.log("Invite", id, message);
    socket.to(`${id}`).emit("invite", message);
  });
});

server.listen(3000, () => {
  console.log("server running at http://localhost:3000");
});
