const colors = require("colors");
const Proverb = require("../models/proverb.model");
const Proverbs = require("../models/proverb.model");

// @desc    Adds new proverb.
// @route   POST proverb/contribute
// @access  protected.
const addProverb = async (req, res) => {
  const { quote, quote_native } = req.body;

  if (!quote) {
    return res.status(404).json({ message: "Please provide a proverb" });
  }

  // Check if authorized.
  if (!req.user) {
    return res.status(401).json({ message: "Access denied" });
  }

  try {
    const quote = await Proverbs.create({
      quote,
      added_by: req.user.id,
      quote_native,
    });

    if (quote) {
      res.status(201).json({ message: "Proverb added successfully" });
    } else {
      res.status(404).json({ message: "Invalid data" });
    }
  } catch (err) {
    res.status(500).json({ message: "Server Error" });
    console.log(colors.bgRed.bold(err));
  }
};

// @desc    Edit proverb.
// @route   PATCH proverb/:contributorId/edit
// @access  protected.
const editProverb = async (req, res) => {
  const { quote, quote_native, unique_to } = req.body;

  if (!req.user) return res.status(401).json({ message: "Access denied" });

  try {
    const foundProverb = await Proverbs.findOne({ proverId: proverbId });
    if (!foundProverb) {
      return res
        .status(404)
        .json({ message: "Proverb not found. May already be deleted" });
    }
    const quote = await Proverbs.findOneAndUpdate({
      proverb,
      unique_to: unique_to_Arr,
      translations: translationsObj,
    });

    if (quote) {
      res.status(201).json({ message: "Proverb updated successfully" });
    } else {
      res.status(404).json({ message: "Invalid data" });
    }
  } catch (err) {
    res.status(500).json({ message: "Server Error" });
    console.log(colors.bgRed.bold(err));
  }
};

// @desc    Delete proverb.
// @route   DELETE proverb/:contributorId/delete
// @access  protected.
const deleteProverb = async (req, res) => {
  res.send("delete proverb");
};

// @desc    Get a contributors proverbs.
// @route   GET proverb/:contributorId/delete
// @access  protected.
const getProverbs = async (req, res) => {
  if (!req.user) return res.status(401).json({ message: "Access denied" });

  try {
    const contributorProverbs = await Proverb.find({
      added_by: req.user._id,
    });

    const data = await contributorProverbs.map((prob) => {
      return {
        id: prob._id,
        quote: prob.quote,
        native: prob.quote_native,
        lang: prob.lang,
        unique_to: prob.unique_to,
        last_updated: prob.updatedAt,
      };
    });
    res.status(200).json({
      message: "success",
      proverb: data,
    });
  } catch (err) {
    console.log(err);
    res.send(err);
  }
};

// @desc    Fetch contributor proverbs.
// @route   GET proverb/:contributorId
// @access  protected.
const getContributorProverbs = async (req, res) => {
  res.send("contributors proverbs");
};

// @desc    Fetch all proverbs.
// @route   GET proverb/{user}/:id/proverbs/all
// @access  protected.
const getAllProverbs = async (req, res) => {
  const proverbs = Proverbs.find({});
  res.send("all proverbs");
};

// @desc    Get proverb.
// @route   GET proverb/
// @access  public.
const getRandomProverb = async (req, res) => {
  res.send("random proverb");
};

module.exports = {
  addProverb,
  editProverb,
  deleteProverb,
  getProverbs,
  getContributorProverbs,
  getAllProverbs,
};
