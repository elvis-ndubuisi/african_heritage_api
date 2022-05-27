const createErr = require("http-errors");
const jwt = require("jsonwebtoken");
require("dotenv").config();

module.exports = {
  signAccessToken: (userId) => {
    return new Promise((resolve, reject) => {
      const payload = {
        name: "payload",
      };

      const secret = process.env.ACCESS_TOKEN;

      const options = {
        expiresIn: "10m",
        issuer: "africa.com",
        audience: userId,
      };
      jwt.sign(payload, secret, options, (err, token) => {
        if (err) {
          console.log(err.message);
          return reject(createErr.InternalServerError());
        }
        resolve(token);
      });
    });
  },
  verifyAccessToken: (req, res, next) => {
    if (!req.headers["authorization"]) return next(createErr.Unauthorized());
    const token = req.headers["authorization"].split(" ")[1];

    jwt.verify(token, process.env.ACCESS_TOKEN, (err, payload) => {
      if (err) {
        // if (err.name === "JsonWebTokenError") {
        //   return next(createErr.Unauthorized());
        // } else {
        //   return next(createErr.Unauthorized(err.message));
        // }
        const message =
          err.name === "JsonWebTokenError" ? "Unauthorized" : err.message;
        return next(createErr.Unauthorized(message));
      }
      req.payload = payload;
      next();
    });
  },
};
