const createErr = require("http-errors");
const jwt = require("jsonwebtoken");
const redisClient = require("../helpers/redis_client");
require("dotenv").config();

module.exports = {
  signAccessToken: (userId, userName, userEmail) => {
    return new Promise((resolve, reject) => {
      const payload = {
        name: String(userName),
        sub: String(userEmail),
      };

      const secret = process.env.ACCESS_TOKEN;

      const options = {
        expiresIn: "16m",
        issuer: "African Heritage",
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
  signRefreshToken: (userId) => {
    return new Promise((resolve, reject) => {
      const payload = {
        name: "payload",
      };

      const secret = process.env.REFRESH_TOKEN;

      const options = {
        expiresIn: "24h",
        issuer: "africa.com",
        audience: userId,
      };
      jwt.sign(payload, secret, options, async (err, token) => {
        if (err) {
          console.log(err.message);
          return reject(createErr.InternalServerError());
        }
        try {
          await redisClient.SET(userId, token, { EX: 21600 });
          resolve(token);
        } catch (err) {
          console.log(err.message);
          return reject(createErr.InternalServerError());
        }
      });
    });
  },
  verifyRefreshToken: (refreshToken) => {
    return new Promise((resolve, reject) => {
      const secret = process.env.REFRESH_TOKEN;
      jwt.verify(refreshToken, secret, async (err, payload) => {
        if (err) {
          return reject(createErr.Unauthorized());
        }
        const userId = payload.aud;

        try {
          const refToken = await redisClient.GET(userId);

          if (refreshToken === refToken) return resolve(userId);
          reject(createErr.Unauthorized());
        } catch (err) {
          console.log(err.message);
          reject(createErr.InternalServerError());
        }
        resolve(userId);
      });
    });
  },
};
