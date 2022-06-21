const router = require("express").Router();
const {
  register,
  login,
  newToken,
  logout,
} = require("../controllers/auth.controller");

router.post("/register", register);
router.post("/login", login);
router.post("/token", newToken);
router.delete("/logout", logout);

module.exports = router;
