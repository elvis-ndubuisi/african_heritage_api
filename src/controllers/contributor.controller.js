const createErr = require("http-errors");
const Contributor = require("../models/contributor.model");
const Adage = require("../models/adage.model");
const validate_email = require("../helpers/validate_email");

// @desc    Add adage
// @route   POST /cnt/profile/adage
// @access  protected
const postAdage = async (req, res, next) => {
  const { adage, tags, country } = req.body;

  try {
    if (!adage || !country)
      throw createErr.BadRequest("provide required fields");

    const similarAdage = await Adage.findOne({ adage });

    if (similarAdage)
      throw createErr.Conflict({
        message: "similar adage already exist",
        adage,
      });
    //   Find owner.
    const foundOwner = Contributor.findById(req.payload.aud);
    if (!foundOwner) throw createErr.NotFound("account not found");

    const newAdage = new Adage({
      adage,
      country,
      //   tags: tags !== [] ? tags.forEach((tag) => tags.push(tag)) : tags,
      owner: req.payload.aud,
    });
    const addedAdage = await newAdage.save();

    res.send(addedAdage);
  } catch (err) {
    next(err);
  }
};

// @desc    Edit adage
//@route    PATCH /cnt/profile/adage?:id
// @access  protected
const patchAdage = async (req, res, next) => {
  const { adage, tags } = req.body;
  const { aud } = req.payload;
  const { id } = req.query;

  try {
    if (!id || !adage.toString())
      throw createErr.BadRequest("provide an adage");

    const foundAdage = await Adage.findById({ _id: id });
    if (!foundAdage) throw createErr.NotFound("requested adage not found");

    // verify claim.
    if (foundAdage.owner.toString() !== aud) throw createErr.Forbidden();

    const updatedAdage = await Adage.updateOne({ id, owner: aud }, { adage });
    if (!updatedAdage) throw createErr.InternalServerError();
    res.send("successful edit");
  } catch (err) {
    next(err);
  }
};

// @desc    Delete adage
// @route   DELETE /cnt/profile/adage?:id
// @access  protected
const deleteAdage = async (req, res, next) => {
  const { id } = req.query;
  const { aud } = req.payload;

  try {
    if (!id) throw createErr.BadRequest();

    const foundAdage = await Adage.findOne({ id });

    if (!foundAdage) throw createErr.NotFound("adage not found");
    if (foundAdage.owner.toString() !== aud) throw createErr.Forbidden();

    const deletedAdage = await Adage.deleteOne({ id, owner: aud });
    if (!deletedAdage) throw createErr.InternalServerError();
    res.send("deleted");
  } catch (err) {
    next(err);
  }
};

// @desc    Edit profile
// @route   PATCH /cnt/profile
// @access  protected
const patchProfile = async (req, res, next) => {
  const { name, email, country } = req.body;

  try {
    if (!req.payload.aud) throw createErr.Forbidden();

    if (!name || !email || !country)
      throw createErr.BadGateway("provide fields to update");

    if (email) {
      const isEmail = validate_email(email);
      if (!isEmail) throw createErr.BadRequest("verify your email");
    }

    const data = {
      name,
      email: email && email,
      country,
    };

    const updatedProfile = await Contributor.findByIdAndUpdate(
      { _id: req.payload.aud },
      { ...data }
    );

    if (!updatedProfile) throw createErr.NotFound("profile not found");
    res.send("updated");
  } catch (err) {
    next(err);
  }
};

module.exports = {
  addAdage: postAdage,
  editAdage: patchAdage,
  deleteAdage,
  editProfile: patchProfile,
};
