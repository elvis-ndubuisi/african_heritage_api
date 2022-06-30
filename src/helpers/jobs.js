const cron = require("node-cron");
const redisClient = require("./redis_client");
const TweetSubscriber = require("../models/tweet.model");
const fetch = require("node-fetch");
const { ListSubscribersV1Paginator } = require("twitter-api-v2");
const { subscribe } = require("../routes/tweet.router");

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
  postAdageOnTwitterTest: () => {
    //   Posts adage of the day on twitter every day by 8:00am.
    cron.schedule("2 * * * * *", async () => {
      // try {
      // } catch (err) {
      //   console.log(err);
      // }
      // await subscribers.forEach(async (subscriber) => {
      //   if (processed.includes(subscriber.subscriberId)) {
      //     return;
      //   }
      //   // tweet
      //   const response = await fetch("http://localhost:5000/tweet/autopost", {
      //     method: "POST",
      //     body: JSON.stringify({ refresh: subscriber.refresh }),
      //     headers: { "Content-Type": "application/json" },
      //   });
      //   await processed.push(subscriber.subscriberId);
      //   console.log(await response.json());
      // });
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
