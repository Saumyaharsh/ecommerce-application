import express from "express";
import dotenv from "dotenv";
import cookieParser from "cookie-parser";
import cors from "cors";

import connectdb from "./config/db.js";
import authroutes from "./routes/auth.route.js";

dotenv.config();
const app = express();
const port = process.env.PORT || 5000;

app.use(
  cors({
    origin: "http://localhost:5177",
    credentials: true,
  }),
);
app.use(express.json());
app.use(cookieParser());

app.use("/api/auth", authroutes);

app.use((error, req, res, next) => {
  res.status(500).json({
    message: "Internal server error",
    error: error.message,
  });
});
app.listen(port, () => {
  connectdb();
  console.log("app is running on ", port);
});
