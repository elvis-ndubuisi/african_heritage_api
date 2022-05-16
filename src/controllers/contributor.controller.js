const bcrypt = require("bcryptjs");
const colors = require("colors");
const Contributor = require("../models/contributor.model");
const jsonToken = require("../helpers/jsonToken.helper");

// @desc    Register contributor locally.
// @route   POST account/join
// @access  public
const registerContributor = async (req, res) => {
  const { name, email, password, country } = req.body;

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
          token: jsonToken.sign({
            id: contributor._id,
            email: contributor.email,
          }),
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
      res.status(200).json({
        success: true,
        user: {
          token: jsonToken.sign({
            id: foundContributor._id,
            email: foundContributor.email,
          }),
        },
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
// @route   GET account/:contrubutorId
// @access  protected.
const getContributorProfile = async (req, res) => {
  // Check if authentication is present.
  if (!req.user) {
    return res.status(401).json({ message: "Not authorized, no token" });
  }

  // Find profile
  try {
    const foundProfile = await Contributor.findById(req.user._id);
    if (foundProfile) {
      return res.status(200).json({
        message: "Profile found",
        user: {
          id: foundProfile._id,
          name: foundProfile.name,
          email: foundProfile.email,
          social: foundProfile.social_link,
          profile: foundProfile.profile_img,
        },
      });
    }
  } catch (err) {
    console.log(err);
    res.send(err);
  }
};

// @desc    Update contributor profile.
// @route   PATCH account/account/:contrubutorId
// @access  protected.
const updateContributorProfile = async (req, res) => {
  const { name, email, social, profile } = req.body;

  if (!req.user) {
    return res.status(401).json({ message: "Access not authorized" });
  }

  const foundProfile = await Contributor.findById(req.user._id);

  // Filter empty fields.
  const data = {
    name: name ? name : foundProfile.name,
    email: email ? email : foundProfile.email,
    social_link: social ? social : foundProfile.social_link,
    profile_img: profile ? profile : foundProfile.profile_img,
  };

  try {
    await Contributor.updateOne({ _id: req.user._id }, { ...data });
    const updatedProfile = await Contributor.findById(req.user._id);
    if (updatedProfile) {
      return res.status(200).json({
        message: "Profile modified",
        user: {
          id: updatedProfile._id,
          name: updatedProfile.name,
          email: updatedProfile.email,
          social: updatedProfile.social_link,
          profile: updatedProfile.profile_img,
        },
      });
    } else {
      return res.status(400).send("error acc");
    }
  } catch (err) {
    console.log(err);
    res.status(400).json({ message: "Account may not be authorized" });
  }
};

module.exports = {
  registerContributor,
  getContributorProfile,
  updateContributorProfile,
  loginContributor,
};
