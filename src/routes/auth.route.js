const router = require("express").Router();
const { register, login } = require("../controllers/auth.controller");

router.post("/account/register", register);
router.post("/account/login", login);

module.exports = router;
