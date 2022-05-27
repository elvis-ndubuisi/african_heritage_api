const createErr = require("http-errors");
const Contributor = require("../models/contributor.model");
const validate_email = require("../helpers/validate_email");
const { signAccessToken } = require("../helpers/jwt_auth");

// @desc    Register new user, generate token.
// @route   POST /account/register
// @route   public
const registerContributor = async (req, res, next) => {
  const { name, password, country, email, gender } = req.body;

  try {
    //   check for empty fields
    if (!name || !password || !country || !email || !gender) {
      throw createErr.BadRequest("provide all fields");
    }
    // validate  email.
    const isEmail = validate_email(email);
    if (!isEmail) throw createErr.BadRequest("invalid email");

    // check for existing user.
    const foundContributor = await Contributor.findOne({ email });
    if (foundContributor)
      throw createErr.Conflict(`${email} is already registered`);

    const contributor = new Contributor({
      name,
      email,
      password,
      country,
      gender,
    });

    const resp = await contributor.save();
    const accessToken = await signAccessToken(resp.id);

    res.send({ accessToken });
    // res.status(201).json({
    //   success: {
    //     status: 200,
    //     message: "Contributor details accepted",
    //     contributor: {
    //       name: resp.name,
    //       id: resp._id,
    //       email: resp.email,
    //       gender: resp.gender,
    //       country: resp.country,
    //     },
    //   },
    // });
  } catch (err) {
    next(err);
  }
};

// @desc    Login registered user, verify token
// @route   POST /account/login
// @route   public
const loginContributor = async (req, res, next) => {
  const { email, password } = req.body;

  try {
    if (!email || !password)
      throw createErr.BadRequest("provide all required fields");

    const isEmail = validate_email(email);
    if (!isEmail) throw createErr.BadRequest("invalid email");

    const foundContributor = await Contributor.findOne({ email });
    if (!foundContributor) throw createErr.NotFound("user not registered");

    const isMatch = await foundContributor.isValidPassword(password);
    if (!isMatch) throw createErr.Unauthorized("invalid email/password");

    const accessToken = await signAccessToken(foundContributor.id);
    res.json({ accessToken, isMatch });
  } catch (err) {
    next(err);
  }
};

module.exports = {
  register: registerContributor,
  login: loginContributor,
};
