const router = require("express").Router();
const {
  registerContributor,
  getContributorProfile,
  updateContributorProfile,
  loginContributor,
} = require("../controllers/contributor.controller");

router.post("/join", registerContributor);
router.post("/login", loginContributor);
router.route("/me").get(getContributorProfile).patch(updateContributorProfile);

module.exports = router;
