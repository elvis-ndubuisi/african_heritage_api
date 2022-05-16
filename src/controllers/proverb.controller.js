const colors = require("colors");
const Proverbs = require("../models/proverb.model");

// @desc    Adds new proverb.
// @route   POST proverb/{user}/contribute
// @access  protected.
const addProverb = async (req, res) => {
  const { proverb, unique_to, translations } = req.body;

  if (!proverb) {
    return res.status(404).json({ message: "Please provide a proverb" });
  }

  const unique_to_Arr = [];
  if (unique_to) {
    await unique_to.forEach((item) => {
      unique_to_Arr.push(item);
    });
  }
  const translationsObj = [];
  if (translations) {
    await translations.forEach((object) => {
      translationsObj.push(object);
    });
  }

  try {
    const quote = await Proverbs.create({
      proverb,
      unique_to: unique_to_Arr,
      translations: translationsObj,
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
// @route   PATCH proverb/{user}/:id/edit
// @access  protected.
const editProverb = async (req, res) => {
  const { proverbId, proverb, unique_to, translations } = req.body;

  if (!proverb) {
    return res.status(404).json({ message: "Please provide a proverb" });
  }

  const unique_to_Arr = [];
  if (unique_to) {
    await unique_to.forEach((item) => {
      unique_to_Arr.push(item);
    });
  }
  const translationsObj = [];
  if (translations) {
    await translations.forEach((object) => {
      translationsObj.push(object);
    });
  }

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
// @route   DELETE proverb/{user}/:id/delete
// @access  protected.
const deleteProverb = async (req, res) => {
  res.send("delete proverb");
};

// @desc    Fetch contributor proverbs.
// @route   GET proverb/{user}/:id/proverbs
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
  getContributorProverbs,
  getAllProverbs,
};
