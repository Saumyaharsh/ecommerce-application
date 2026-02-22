import express from "express";
import dotenv from "dotenv";
import cookieParser from "cookie-parser";

import connectdb from "./config/db.js";
import authroutes from "./routes/auth.routes.js";
import userroutes from "./routes/user.routes.js";
import postroutes from "./routes/post.routes.js";
import notificationroutes from "./routes/notification.route.js";

dotenv.config();
const app = express();
const port = process.env.PORT || 5000;
app.use(cookieParser());
app.use(express.json({ limit: "5mb" }));

app.use("/api/auth", authroutes);
app.use("/api/users", userroutes);
app.use("/api/posts", postroutes);
app.use("/api/notifications", notificationroutes);

app.use((error, req, res, next) => {
  res.status(500).json({
    message:
      process.env.NODE_ENV === "development"
        ? error.message
        : "Internal server error",
  });
});
app.listen(port, () => {
  connectdb();
  console.log("Server is running on port", port);
});
