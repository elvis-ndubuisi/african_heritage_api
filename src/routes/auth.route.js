const credentials = require("../middleware/credentials.middleware");
const cors = require("cors");
const corsConfig = require("../config/cors.config");
const router = require("express").Router();
const {
  register,
  login,
  newToken,
  logout,
} = require("../controllers/auth.controller");

// router.use(cors(corsConfig.contributorCORS));
// router.use(credentials);
router.post("/account/register", register);
router.post("/account/login", login);
router.post("/account/ref", newToken);
router.delete("/account/logout", logout);

module.exports = router;
