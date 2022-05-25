// @desc    Generates random int between 0 and limit.
// @param   limit -> Int/
const genRandom = async (limit) => {
  let result = Math.floor(Math.random() * limit);
};

module.exports = genRandom;
