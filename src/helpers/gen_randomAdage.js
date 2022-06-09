const Adage = require("../models/adage.model");

const gen_randomAdage = async (field) => {
  /* Returns a randomly selected document from Adage collection */
  let adage;
  const count = await Adage.find().estimatedDocumentCount();
  const seed = await Math.floor(Math.random() * count);
  if (!field) {
    adage = await Adage.findOne().skip(seed);
  } else {
    console.log(field);
    adage = await Adage.findOne({ field }).skip(seed);
  }
  return { adage, seed };
};

module.exports = gen_randomAdage;
