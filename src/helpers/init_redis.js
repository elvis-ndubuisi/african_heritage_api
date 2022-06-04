const redis = require("redis");

const redisClient = redis.createClient();
const initRedis = async () => {
  redisClient.on("connect", () => {
    console.log("connecting");
  });

  redisClient.on("ready", () => {
    console.log("ready");
  });

  redisClient.on("error", (err) => {
    console.log(err.message);
  });

  await redisClient.connect();

  redisClient.on("end", () => {
    console.log("disconnected");
  });
  process.on("SIGINT", async () => {
    await redisClient.QUIT();
    process.exit(0);
  });
};
module.exports = initRedis;
