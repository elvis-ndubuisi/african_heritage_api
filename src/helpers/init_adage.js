const redisClient = require("./redis_client");

module.exports = async (fn) => {
  const value = await fn();
  redisClient.SET("adage", value.adage.adage.toString(), { EX: 86400 });
};
