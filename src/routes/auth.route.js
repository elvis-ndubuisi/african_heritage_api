const router = require("express").Router();
const cors = require("cors");
const corsConfig = require("../config/cors.config");
const {
  register,
  login,
  newToken,
  logout,
} = require("../controllers/auth.controller");

router.use(cors(corsConfig.contributorCORS));
router.post("/register", register);
router.post("/login", login);
router.post("/token", newToken);
router.delete("/logout", logout);

module.exports = router;
