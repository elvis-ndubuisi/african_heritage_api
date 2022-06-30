const createErr = require("http-errors");
const Contributor = require("../models/contributor.model");
const Adage = require("../models/adage.model");
const validate_email = require("../helpers/validate_email");
const dummy = require("../../jummy");

// @desc    Add adage
// @route   POST /cnt/profile/adage
// @access  protected
const postAdage = async (req, res, next) => {
  const { adage, tags, uniqueTo, interpretation, translations } = req.body;

  try {
    if (!adage || !uniqueTo)
      throw createErr.BadRequest("provide required fields");

    if (!req.payload.aud) throw createErr.Forbidden();

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
      uniqueTo: uniqueTo,
      tags: [],
      interpretation: interpretation,
      translations: translations,
      owner: req.payload.aud,
    });
    await newAdage.save();

    res.send({
      status: "success",
      message: "adage added",
    });
  } catch (err) {
    next(err);
  }
};

// @desc    Add adages
// @route   POST /cnt/profile/adage/batch
// @access  protected
const postBatchAdage = async (req, res, next) => {
  // const { patchObject } = req.body;

  try {
    // if (!patchObject) throw createErr.BadRequest("patch object is invalid");

    if (!req.payload.aud) throw createErr.Forbidden();
    //   Find owner.
    const foundOwner = Contributor.findById(req.payload.aud);
    if (!foundOwner) throw createErr.NotFound("account not found");

    await dummy.forEach(async (doc) => {
      try {
        const newAdage = new Adage({
          adage: doc.adage,
          uniqueTo: doc.uniqueTo,
          interpretation: doc.interpretation,
          owner: req.payload.aud,
          translations: doc.translations,
          tags: doc.tags,
        });

        await newAdage.save();
      } catch (err) {
        next(err);
      }
    });

    res.send("okay");
  } catch (err) {
    next(err);
  }
};

// @desc    Edit adage
//@route    PATCH /cnt/profile/adage?:id
// @access  protected
const patchAdage = async (req, res, next) => {
  const { adage, country, tags } = req.body;
  const { aud } = req.payload;
  const { id } = req.query;

  try {
    if (!id || !adage.toString())
      throw createErr.BadRequest("provide an adage");

    if (!aud) throw createErr.Forbidden();

    const foundAdage = await Adage.findById({ _id: id });
    if (!foundAdage) throw createErr.NotFound("requested adage not found");

    // verify claim.
    if (foundAdage.owner.toString() !== aud) throw createErr.Forbidden();

    const updatedAdage = await Adage.findOneAndUpdate(
      { _id: id, owner: aud },
      { adage, country }
    );
    if (!updatedAdage) throw createErr.InternalServerError();
    res.send("adage updated");
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
    if (!id) throw createErr.BadRequest("provide adage id");
    if (!aud) throw createErr.Forbidden();

    const foundAdage = await Adage.findOne({ _id: id });

    if (!foundAdage) throw createErr.NotFound("adage not found");
    if (foundAdage.owner.toString() !== aud) throw createErr.Forbidden();

    const deletedAdage = await Adage.findOneAndDelete({ _id: id, owner: aud });
    if (!deletedAdage) throw createErr.InternalServerError();
    res.send("adage deleted");
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
      throw createErr.BadRequest("provide fields to update");

    if (email) {
      const isEmail = validate_email(email);
      if (!isEmail) throw createErr.BadRequest("invalid email");
    }

    const updatedProfile = await Contributor.findByIdAndUpdate(
      { _id: req.payload.aud },
      { name, email: email, country }
    );

    if (!updatedProfile) throw createErr.NotFound("profile not found");
    res.send("profile updated");
  } catch (err) {
    next(err);
  }
};

// @desc    Get adages
//@route    GET /cnt/profile
// @access  protected
const getContributorAdages = async (req, res, next) => {
  try {
    let { page, size } = req.query;

    // Set default pagination params.
    if (!page) page = 1;
    if (!size) size = 8;

    const limit = parseInt(size);
    const skip = (page - 1) * size;

    if (!req.payload.aud) throw createErr.Forbidden();
    const count = await Adage.find({ owner: req.payload.aud }).countDocuments();

    if (count === 0) {
      return res.send({ page: 0, size: 0, count: 0, data: [] });
    }

    const adages = await Adage.find({ owner: req.payload.aud })
      .limit(limit)
      .skip(skip);

    const data = adages.map((adage) => {
      return {
        adage: adage.adage,
        country: adage.country,
        tags: adage.tags,
        id: adage.id,
      };
    });

    res.send({
      page: parseInt(page),
      size: parseInt(size),
      count,
      data,
    });
  } catch (err) {
    next(err);
  }
};

module.exports = {
  getAdages: getContributorAdages,
  addAdage: postAdage,
  editAdage: patchAdage,
  deleteAdage,
  editProfile: patchProfile,
  postBatchAdage,
};
