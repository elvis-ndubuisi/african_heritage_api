const createErr = require("http-errors");
const Adage = require("../models/adage.model");

// @desc    Get random adage.
// @route   GET /adage
// @access  public
const getRandAdage = async (req, res, next) => {};

module.exports = {
  getAdage: getRandAdage,
};
