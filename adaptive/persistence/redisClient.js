// Backend2/adaptive/persistence/redisClient.js

import { createClient } from "redis";

let redisClient = null;
let redisAvailable = false;
let redisDisabled = false;

async function initRedis() {
  // 🔒 Явно отключаем Redis, если не нужен
  if (process.env.DISABLE_REDIS === "true") {
    console.log("ℹ️ Redis disabled by config, using in-memory storage");
    redisDisabled = true;
    redisAvailable = false;
    return;
  }

  try {
    redisClient = createClient({
      url: process.env.REDIS_URL || "redis://localhost:6379",
      socket: {
        reconnectStrategy: () => null // ❗ отключаем бесконечные ретраи
      }
    });

    redisClient.on("error", (err) => {
      console.warn("⚠️ Redis unavailable, fallback to memory");
      redisAvailable = false;
    });

    await redisClient.connect();
    redisAvailable = true;
    console.log("✅ Redis connected");
  } catch (err) {
    console.warn("⚠️ Redis not available, using in-memory storage");
    redisAvailable = false;
  }
}

function getRedisClient() {
  if (redisDisabled || !redisAvailable) {
    return null;
  }
  return redisClient;
}

export { initRedis, getRedisClient };
