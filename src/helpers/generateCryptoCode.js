const crypto = require("crypto");

// @desc  Generates random crypto bytes
// @params  "base64", "ascii", "hex"
const generateCryptoCode = (encoding = "base64") => {
  return crypto.randomBytes(64).toString(encoding);
};

module.exports = generateCryptoCode;
