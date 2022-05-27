const createErr = require("http-errors");
const Contributor = require("../models/contributor.model");
const Adage = require("../models/adage.model");

// @desc Add adage
// @route POST /cnt/profile/adage
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

// @desc Edit adage
//@route PATCH /cnt/profile/adage/:id
const patchAdage = async (req, res, next) => {
  const { id, adage, country, tags } = req.body;
  const { aud } = req.payload;
  console.log(req.body);
  console.log(req.params);
  console.log(req.payload.aud);
  //   try {
  //     const foundAdage = await Adage.findById({ id });
  //     if (!foundAdage) throw createErr.NotFound("requested adage not found");

  //     // verify claim.
  //     if (foundAdage.owner !== aud) throw createErr.Forbidden();

  //     const updatedAdage = await Adage.updateOne(
  //       { id, owner: aud },
  //       { adage, country }
  //     );
  //     res.send(updatedAdage);
  //   } catch (err) {
  //     next(err);
  //   }

  res.send("editn adage");
};

module.exports = { addAdage: postAdage, editAdage: patchAdage };
