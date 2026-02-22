import express from "express";
import dotenv from "dotenv";
import authRoutes from "./routes/auth.routes.js";
import { connectDB } from "./lib/db.js";
import cookieparser from "cookie-parser";
import messageroutes from "./routes/message.routes.js";
import cors from "cors";
import { server, io, app } from "./lib/socket.js";

dotenv.config();

app.use(
  cors({
    origin: "http://localhost:5173",
    credentials: true,
    methods: ["GET", "POST", "PUT", "DELETE", "OPTIONS"],
    allowedHeaders: ["Content-Type", "Authorization"],
  })
);
app.use(express.json({ limit: "10mb" }));
app.use(express.urlencoded({ limit: "10mb", extended: true }));

app.use(cookieparser());

app.use("/api/auth", authRoutes);
app.use("/api/message", messageroutes);
const port = process.env.PORT || 5001;
server.listen(port, () => {
  console.log(`Server is running on port: ${port}`);
  connectDB();
});
