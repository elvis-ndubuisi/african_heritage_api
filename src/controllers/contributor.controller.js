const bcrypt = require("bcryptjs");
const colors = require("colors");
const Contributor = require("../models/contributor.model");
const jwt = require("jsonwebtoken");

// @desc    Register contributor locally.
// @route   POST account/join
// @access  public
const registerContributor = async (req, res) => {
  const { name, email, password, country } = req.body;
  console.log(req.body);

  // Check for empty field.
  if (!name || !email || !password || !country) {
    return res.status(400).json({
      message: "Please provide all required fields",
    });
  }

  try {
    //  Check for existing contributor.
    const foundContributor = await Contributor.findOne({ email });
    if (foundContributor) {
      return res.status(400).json({
        message: "User already exists",
      });
    }

    // Hash password.
    const salt = await bcrypt.genSalt(10);
    const hash = await bcrypt.hash(password, salt);

    //   Create new contributor.
    const contributor = await Contributor.create({
      name,
      email,
      password: hash,
      country,
    });

    //   Check if operation was successful.
    if (contributor) {
      return res.status(201).json({
        message: "Contributor created",
        user: {
          _id: contributor._id,
          email: contributor.email,
          name: contributor.name,
        },
      });
    } else {
      res.status(400).json({ message: "Invalid user data" });
    }
  } catch (err) {
    res.status(500).json({ message: "Serve Error" });
    console.log(colors.bgRed.bold(err));
  }
};

// @desc    Login contributor locally either by email or name.
// @route   POST account/login
// @access  public.
const loginContributor = async (req, res) => {
  const { name, password } = req.body;

  if (!name || !password) {
    return res
      .status(400)
      .json({ message: "Name/email and password are required." });
  }

  try {
    // Validate account.
    const foundContributor = await Contributor.findOne({
      email: name,
    });
    if (!foundContributor) {
      return res.status(401).json({ message: "Account not found" });
    }

    // Validate password.
    const passwordMatch = await bcrypt.compare(
      password,
      foundContributor.password
    );
    if (passwordMatch) {
      // create JWT.
      res.status(200).json({
        success: true,
      });
    } else {
      res.status(401).json({ message: "Incorrect Password" });
    }
  } catch (err) {
    res.status(500).json({ message: "Server Error" });
    console.log(colors.bgRed.bold(err));
  }
};

// @desc    Get contributor profile.
// @route   GET account/{name}
// @access  protected.
const getContributorProfile = async (req, res) => {
  res.send("get profile");
};

// @desc    Update contributor profile.
// @route   PATCH account/{name}/update.
// @access  protected.
const updateContributorProfile = async (req, res) => {
  res.send("update profile");
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

// @desc    Retrieve lost account if opened locally.
// const retrieveAccount = async (req, res) => {
//   const { email } = req.body;

//   if (!email) {
//     return res.status(400).json({ message: "Email field can't be empty" });
//   }

//   const foundAccount = await Contributor.findOne({ email });
// };

module.exports = {
  registerContributor,
  getContributorProfile,
  updateContributorProfile,
  loginContributor,
  getContributorProfile,
  getAllProverbs,
};
