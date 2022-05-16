const jsonToken = require("../helpers/jsonToken.helper");
const Contributor = require("../models/contributor.model");

const authenticate = async (req, res, next) => {
  let token;

  //   Check header
  if (
    req.headers.authorization &&
    req.headers.authorization.startsWith("Bearer")
  ) {
    try {
      // Get token.
      token = req.headers.authorization.split(" ")[1];

      //   Verify token.
      const decoded = jsonToken.verify(token);
      req.user = await Contributor.findById({ _id: decoded.id }).select(
        "-password"
      );
      next();
    } catch (err) {
      console.log(err);
      res.status(401).json({ message: "Not authorized" });
    }
  }
  if (!token) {
    return res.status(401).json({ message: "Not authorized, no token" });
  }
};

module.exports = authenticate;
