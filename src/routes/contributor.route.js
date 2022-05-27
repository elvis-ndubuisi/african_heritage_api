const router = require("express").Router();
const {
  addAdage,
  editAdage,
  deleteAdage,
  editProfile,
} = require("../controllers/contributor.controller");
const { verifyAccessToken } = require("../helpers/jwt_auth");

router.use(verifyAccessToken);
router.patch("/cnt/profile", editProfile);
router.post("/cnt/profile/adage", addAdage);
router.patch("/cnt/profile/adage", editAdage);
router.delete("/cnt/profile/adage", deleteAdage);

module.exports = router;
