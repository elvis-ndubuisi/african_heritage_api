const router = require("express").Router();
const { register, login, newToken } = require("../controllers/auth.controller");

router.post("/account/register", register);
router.post("/account/login", login);
router.post("/account/ref", newToken);

module.exports = router;
