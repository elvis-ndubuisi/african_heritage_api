const colors = require("colors");
const Proverb = require("../models/proverb.model");

// @desc    Adds new proverb.
// @route   POST cnt/contribute
// @access  protected.
const addProverb = async (req, res) => {
  const { quote, quote_native, unique_to, lang } = req.body;

  if (!quote) {
    return res.status(404).json({ message: "Please provide a proverb" });
  }

  // Check if authorized.
  if (!req.user) {
    return res.status(401).json({ message: "Access denied" });
  }

  try {
    // Check is quote is similar.
    const foundProverb = Proverb.find({ quote });
    if (foundProverb) {
      return res.status(200).json({ message: "Proverb already present" });
    }

    const proverb = await Proverb.create({
      quote,
      quote_native,
      lang,
      unique_to,
      added_by: req.user.id,
    });

    res.status(200).json({ message: "Proverb added successfully", proverb });
  } catch (err) {
    console.log(err);
    res.status(500).json({ message: "something went wrong" });
  }

  // try {
  //   const quote = await Proverbs.create({
  //     quote,
  //     added_by: req.user.id,
  //     quote_native,
  //     unique_to,
  //   });

  //   if (quote) {
  //     res.status(201).json({ message: "Proverb added successfully" });
  //   } else {
  //     res.status(404).json({ message: "Invalid data" });
  //   }
  // } catch (err) {
  //   res.status(500).json({ message: "Server Error" });
  //   console.log(colors.bgRed.bold(err));
  // }
};

// @desc    Edit proverb.
// @route   PATCH cnt/:proverbId/edit/:proverbId
// @access  protected.
const editProverb = async (req, res) => {
  const { quote, quote_native, unique_to, lang } = req.body;
  const { contributorId, proverbId } = req.params;

  if (!req.user || !(req.user.id.toString() === contributorId))
    return res.status(401).json({ message: "Access denied" });

  try {
    const foundProverb = await Proverb.findOne({
      added_by: req.user.id,
      _id: proverbId,
    });

    if (!foundProverb)
      return res.status(404).json({ message: "proverb not found" });

    // Filter empty fields.
    const data = {
      quote: quote ? quote : foundProverb.quote,
      email: quote_native ? quote_native : foundProverb.quote_native,
      unique_to: lang ? lang : foundProverb.unique_to,
      lang: lang ? lang : foundProverb.lang,
    };
    await Proverb.findByIdAndUpdate(proverbId, data);
    const updatedProverb = await Proverb.findById(proverbId);
    res.status(200).json({ message: "updated", updatedProverb });
  } catch (err) {
    console.log(err);
    res.status(500).json({ message: "Internal server error" });
  }
};

// @desc    Delete proverb.
// @route   DELETE cnt/:contributorId/delete/:proverbId
// @access  protected.
const deleteProverb = async (req, res) => {
  const { quote, quote_native, unique_to, lang } = req.body;
  const { contributorId, proverbId } = req.params;

  if (!req.user || !(req.user.id.toString() === contributorId))
    return res.status(401).json({ message: "Access denied" });

  try {
    const foundProverb = await Proverb.findOne({
      added_by: req.user.id,
      _id: proverbId,
    });

    if (!foundProverb)
      return res.status(404).json({ message: "proverb not found" });

    const deletedProverb = await Proverb.findByIdAndDelete(proverbId);
    res.status(200).json({ message: "deleted", deletedProverb });
  } catch (err) {
    console.log(err);
    res.status(500).json({ message: "Internal server error" });
  }
};

// @desc    Get a contributors proverbs.
// @route   GET cnt/:contributorId/delete
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

// @desc    Get a proverb at random.
// @route   GET proverb/
// @access  public.
const getRandomProverb = async (req, res) => {
  try {
    const proverbs = await Proverb.find();
    res.send(proverbs);
  } catch (err) {
    console.log(err);
    res.send("error ");
  }
};

module.exports = {
  addProverb,
  editProverb,
  deleteProverb,
  getProverbs,
  getRandomProverb,
};
