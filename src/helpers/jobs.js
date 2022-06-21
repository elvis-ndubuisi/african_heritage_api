const cron = require("node-cron");
const redisClient = require("./redis_client");
const { TwitterApi } = require("twitter-api-v2");

const ElvisNdubuisiClient = new TwitterApi(
  process.env.AFRICAN_HERITAGE_B_TOKEN
);

module.exports = {
  postAdageOnTwitter: () => {
    //   Posts adage of the day on twitter every day by 8:00am.
    cron.schedule("0 8 * * *", async () => {
      const adage = await redisClient.GET("adage");
      await ElvisNdubuisiClient.v2.tweet({
        text: adage,
      });
    });
  },
  cacheAdageOfTheDay: (fn) => {
    cron.schedule("0 0 * * *", async () => {
      // Generates and cache random adage of the day every 12am
      try {
        const { adage } = await fn();
        redisClient.SET("adage", adage.adage.toString(), { EX: 86400 });
      } catch (err) {
        console.error(err);
      }
    });
  },
};
