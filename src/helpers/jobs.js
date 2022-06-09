const cron = require("node-cron");
const redisClient = require("./redis_client");

module.exports = {
  postAdageOnTwitter: () => {
    //   Posts adage of the day on twitter every day by 8:00am.
    cron.schedule("0 8 * * *", () => {
      console.log("post on twitter");
    });
  },
  cacheAdageOfTheDay: (fn) => {
    cron.schedule("0 0 * * *", async () => {
      // Generates and cache random adage of the day every 12am
      const value = await fn();
      redisClient.SET("adage", value.adage.adage.toString(), { EX: 86400 });
    });
  },
};
