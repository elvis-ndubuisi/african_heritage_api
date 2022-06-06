const router = require("express").Router();
const {
  register,
  login,
  newToken,
  logout,
} = require("../controllers/auth.controller");

router.post("/account/register", register);
router.post("/account/login", login);
router.post("/account/ref", newToken);
router.delete("/account/logout", logout);

module.exports = router;
