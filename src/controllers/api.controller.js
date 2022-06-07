const Adage = require("../models/adage.model");
const createErr = require("http-errors");
const redisClient = require("../helpers/redis_client");

// @desc    Get random adage.
// @route   GET /adage
// @access  public
const getRandAdage = async (req, res, next) => {
  try {
    const count = await Adage.find().estimatedDocumentCount();
    const rand = await Math.floor(Math.random() * count);
    const value = await Adage.findOne().skip(rand);
    res.json({ value: value.adage, rand });
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
    const count = await Adage.find().estimatedDocumentCount();
    const rand = await Math.floor(Math.random() * count);
    const adage = await Adage.findOne({ country }).skip(rand);
    res.send(adage);
  } catch (err) {
    next(err);
  }
};

// @desc    Get the day's adage from cache.
// @route   GET /adage/aod
// @access  public
const adageOfTheDay = async (req, res, next) => {};

module.exports = {
  getAdage: getRandAdage,
  queryAdage,
  adageOfTheDay,
};
