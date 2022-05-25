const jwt = require("jsonwebtoken");

const sign = (payload, options = { expiresIn: "24h" }) => {
  return jwt.sign(payload, process.env.TOKEN_ACCESS_KEY, options);
};

const verify = (token) => {
  return jwt.verify(token, process.env.TOKEN_ACCESS_KEY);
};

const jsonToken = {
  sign,
  verify,
};

module.exports = jsonToken;
