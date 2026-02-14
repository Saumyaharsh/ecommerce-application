import dotenv from "dotenv";

import Redis from "ioredis";
dotenv.config();

export const redis = new Redis(
  process.env.REDIS_URL, // the url will get deleted after 14 days
);
// await redis.set("foo", "bar");
redis.on("connect", () => {
  console.log("✅ Redis connected");
});

redis.on("error", (err) => {
  console.error("❌ Redis error:", err.message);
});
