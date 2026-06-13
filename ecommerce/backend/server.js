import express from "express";
import dotenv from "dotenv";
import cookieParser from "cookie-parser";
import path from "path";
import connectdb from "./config/db.js";
import productroutes from "./routes/product.routes.js";
import authroutes from "./routes/auth.route.js";
import cartroutes from "./routes/cart.route.js";
import couponroutes from "./routes/coupon.route.js";
import paymentroutes from "./routes/payment.route.js";
import analyticsroutes from "./routes/analytics.route.js";
dotenv.config();
const app = express();
const port = 5000;
app.use(express.json({ limit: "10mb" }));
app.use(cookieParser());
const __dirname = path.resolve();
app.use("/api/auth", authroutes);
app.use("/api/products", productroutes);
app.use("/api/cart", cartroutes);
app.use("/api/coupons", couponroutes); // learn this from gpt controller
app.use("/api/payments", paymentroutes); // learn [payment routes] from gpt controller
app.use("/api/analytics", analyticsroutes); // not completed the graph data, felt not required

app.use((error, req, res, next) => {
  res.status(500).json({
    message: "Internal server error",
    error: error.message,
  });
});
if (process.env.NODE_ENV === "production") {
  app.use(express.static(path.join(__dirname, "/frontend/dist")));
  app.get("*", (req, res) => {
    res.sendFile(path.resolve(__dirname, "frontend", "dist", "index.html"));
  });
}
app.listen(port, () => {
  connectdb();
  console.log("Server is running on port ", port);
});
