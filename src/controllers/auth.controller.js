const createErr = require("http-errors");
const Contributor = require("../models/contributor.model");
const validate_email = require("../helpers/validate_email");
const {
  signAccessToken,
  signRefreshToken,
  verifyRefreshToken,
} = require("../helpers/jwt_auth");
const redisClient = require("../helpers/redis_client");

// @desc    Register new user, generate tokens.
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
    const refreshToken = await signRefreshToken(resp.id, resp.name, resp.email);

    res.send({
      accessToken,
      refreshToken,
      country: resp.country,
      gender: resp.gender,
    });
  } catch (err) {
    next(err);
  }
};

// @desc    Login registered user, generate tokens.
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

    const accessToken = await signAccessToken(
      foundContributor.id,
      foundContributor.name,
      foundContributor.email
    );
    const refreshToken = await signRefreshToken(foundContributor.id);

    res.send({
      accessToken,
      refreshToken,
      country: foundContributor.country,
      gender: foundContributor.gender,
    });
  } catch (err) {
    next(err);
  }
};

// @desc    Verifies refreshToken and generates new refreshToken and accessToken.
// @route   POST /account/verify
// @route   public
const generateNewRefreshToken = async (req, res, next) => {
  try {
    const { refreshToken } = req.body;
    if (!refreshToken) throw createErr.BadRequest();
    const userId = await verifyRefreshToken(refreshToken);

    const accessToken = await signAccessToken(userId);
    const refT = await signRefreshToken(userId);
    // set new refresh token.
    res.send({ accessToken, refreshToken: refT });
  } catch (err) {
    next(err);
  }
};

// @desc    Verifies refreshTokens and deletes token from cookie and redis store.
// @route   DELETE /account/logout
// @route   public
const logout = async (req, res, next) => {
  try {
    const { refreshToken } = req.body;
    if (!refreshToken) throw createErr.BadRequest();
    const userId = await verifyRefreshToken(refreshToken);

    const resp = await redisClient.DEL(userId);
    if (resp) {
      return res.sendStatus(204);
    }
  } catch (err) {
    next(err);
  }
};

module.exports = {
  register: registerContributor,
  login: loginContributor,
  newToken: generateNewRefreshToken,
  logout,
};
