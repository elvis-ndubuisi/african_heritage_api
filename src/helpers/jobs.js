const cron = require("node-cron");
const redisClient = require("./redis_client");
const Adage = require("../models/adage.model");

module.exports = {
  postAdageOnTwitter: () => {
    //   Posts adage of the day on twitter every day by 8:00am.
    cron.schedule("0 8 * * *", () => {
      console.log("post on twitter");
    });
  },
  cacheAdageOfTheDay: () => {
    cron.schedule("0 0 * *", () => {
      // Generate and cache adage of the day every 12am
      redisClient.SET("aod", "adage", { EX: 86400 });
    });
  },
};
