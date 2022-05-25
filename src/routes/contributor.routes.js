const router = require("express").Router();
const {
  registerContributor,
  getContributorProfile,
  updateContributorProfile,
  loginContributor,
} = require("../controllers/contributor.controller");
const authenticate = require("../middlewares/auth.middleware");

router.post("/join", registerContributor);
router.post("/login", loginContributor);
router
  .route("/:contributorId")
  .get(authenticate, getContributorProfile)
  .patch(authenticate, updateContributorProfile);

module.exports = router;
