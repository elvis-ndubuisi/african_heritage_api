const Adage = require("../models/adage.model");
const createErr = require("http-errors");

const gen_randomAdage = async (field) => {
  /* Returns a randomly selected document from Adage collection */
  let adage;
  const count = await Adage.find().estimatedDocumentCount();
  const seed = await Math.floor(Math.random() * count);
  if (!field) {
    adage = await Adage.findOne().skip(seed);
  } else {
    adage = await Adage.findOne({ country: field }).skip(seed);
    if (!adage) throw createErr.NotFound("No adage found");
  }
  return { adage, seed };
};

module.exports = gen_randomAdage;
