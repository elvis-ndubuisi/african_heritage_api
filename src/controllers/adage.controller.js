const genRandomAdage = require("../helpers/gen_randomAdage");
const createErr = require("http-errors");
const redisClient = require("../helpers/redis_client");

// @desc    Get random adage.
// @route   GET /adage
// @access  public
const getRandAdage = async (req, res, next) => {
  try {
    const value = await genRandomAdage();
    res.json({
      id: value.seed,
      adage: value.adage.adage,
      uniqueTo: value.adage.uniqueTo,
      translations: value.adage.translations,
      interpretation: value.adage.interpretation,
    });
  } catch (err) {
    next(err);
  }
};

// @desc    Get random adage by query
// @route   GET /adage/query?
// @access  public
const queryAdage = async (req, res, next) => {
  try {
    const { country } = req.query;
    const value = await genRandomAdage(country);
    res.json({
      adage: value.adage.adage,
      country: value.adage.country,
      id: value.seed,
    });
  } catch (err) {
    next(err);
  }
};

// @desc    Get the day's adage from cache.
// @route   GET /adage/aod
// @access  public
const adageOfTheDay = async (req, res, next) => {
  const adage = await redisClient.GET("adage");
  try {
    if (!adage)
      throw createErr.NotFound("Oops... seems no adage is cached yet!...");
    res.send(adage);
  } catch (err) {
    next(err);
  }
};

module.exports = {
  getAdage: getRandAdage,
  queryAdage,
  adageOfTheDay,
};
