import express from "express";
import dotenv from "dotenv";
import authRoutes from "./routes/auth.routes.js";
import connectdb from "./config/db.js";
import messageroutes from "./routes/message.routes.js";
import cookieParser from "cookie-parser";
import usersroutes from "./routes/users.routes.js";
import { app, server } from "./socket/socket.js";
dotenv.config();

const port = process.env.PORT || 5000;

// Adding global middleware for parsing json -- for all routes
app.use(express.json());
app.use(cookieParser());

// Adding middlewares for specific routes
app.use("/api/auth", authRoutes);
// all authRoutes will start with /api/auth and authRoutes are instance of expressRouter

// using routes for message functionality
app.use("/api/message", messageroutes);
app.use("/api/users", usersroutes);

server.listen(port, () => {
  connectdb();
  console.log(`Server is running on ${port}`);
});
