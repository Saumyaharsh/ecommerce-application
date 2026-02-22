import { Server } from "socket.io";
import express from "express";
import http from "http";

export const app = express();
export const server = http.createServer(app);

export const io = new Server(server, {
  cors: {
    origin: ["http://localhost:5173"],
  },
});

export function getReceiversocketId(userId) {
  return usersocketMap[userId];
}

// use to store online users
const usersocketMap = {};

io.on("connection", (socket) => {
  console.log("A user is connected", socket.id);
  const userId = socket.handshake.query.userId;
  if (userId) usersocketMap[userId] = socket.id;

  // send message to everyone
  io.emit("getOnlineUsers", Object.keys(usersocketMap));
  socket.on("disconnect", () => {
    console.log("A user is disconnected", socket.id);
    delete usersocketMap[userId];
    io.emit("getOnlineUsers", Object.keys(usersocketMap));
  });
});
