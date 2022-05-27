const router = require("express").Router();
const { addAdage } = require("../controllers/contributor.controller");
const { verifyAccessToken } = require("../helpers/jwt_auth");

router.use(verifyAccessToken);
router.post("/cnt/profile/adage", addAdage);

module.exports = router;
