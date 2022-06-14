const redis = require("redis");
const colors = require("colors");
require("dotenv").config();

const redisClient = redis.createClient({
  url: process.env.REDIS_URL,
  password: process.env.REDIS_PASSWORD,
});

redisClient.on("connect", () => {
  console.log("\tInit:".yellow.bold + "\tCacheSys");
});

redisClient.on("ready", () => {
  console.log("\tReady:".yellow.bold + "\tCacheSys");
});

redisClient.on("error", (err) => {
  console.log(colors.red.italic(err.message));
});

redisClient.on("end", () => {
  console.log("disconnected".yellow);
});

process.on("SIGINT", async () => {
  await redisClient.quit();
  process.exit(0);
});

module.exports = redisClient;
