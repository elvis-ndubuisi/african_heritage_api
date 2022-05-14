const bcrypt = require("bcryptjs");
const Contributor = require("../models/contributor.model");

// @desc    Register contributor locally.
// @route   account/join
// @access  public
const registerContributor = async (req, res) => {
  const { name, email, password, country } = req.body;

  if (!name || !email || !password || !country) {
    return res.status(400).json({
      message: "Please provide all required fields",
    });
  }

  try {
    //   Check for existing contributor.
    const foundContributor = Contributor.findOne({ email });
    if (foundContributor) {
      return res.status(400).json({
        message: "User already exists",
      });
    }

    //   Create new contributor.
    const salt = await bcrypt.genSalt(10);
    const hash = await bcrypt.hash(password, salt);

    const contributor = await Contributor.create({
      name,
      email,
      password: hash,
      country,
    });

    //   Check if operation was successful.
    if (contributor) {
      return res.status(201).json({ message: "Contributor created" });
    } else {
      res.status(400).json({ message: "Invalid user data" });
    }
  } catch (err) {}
};

const registerContributorGoogle = () => {};

const registerContributorFacebook = () => {};

const loginContributor = () => {};

// @desc    Retrieve lost account if opened locally.
const retrieveAccount = async (req, res) => {
  const { email } = req.body;

  if (!email) {
    return res.status(400).json({ message: "Email field can't be empty" });
  }

  const foundAccount = await Contributor.findOne({ email });
};

module.exports = {
  registerContributor,
  registerContributorGoogle,
  registerContributorFacebook,
  loginContributor,
};
