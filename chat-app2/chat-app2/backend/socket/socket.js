import { Server } from "socket.io";
import http from "http";
import express from "express";
const app = express();
const server = http.createServer(app);
const io = new Server(server, {
  cors: {
    origin: ["http://localhost:3000"],
    methods: ["GET", "POST"],
  },
});
// creating map to get online users
const usersocketmap = {};
export const getsocketid = (receiverid) => {
  return usersocketmap[receiverid];
};
io.on("connection", (socket) => {
  const userid = socket.handshake.query.userId;
  if (userid) {
    usersocketmap[userid] = socket.id;
  }
  //Object.keys(usersocketmap)
  io.emit("getonlineusers", Object.keys(usersocketmap));
  console.log("A user connected", socket.id);
  socket.on("disconnect", () => {
    delete usersocketmap[userid];
    io.emit("getonlineusers", Object.keys(usersocketmap));
    console.log("A user disconnected ", socket.id);
  });
});
export { app, server, io };
