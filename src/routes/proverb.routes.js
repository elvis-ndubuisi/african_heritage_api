const router = require("express").Router();
const {
  addProverb,
  editProverb,
  deleteProverb,
  getProverbs,
} = require("../controllers/proverb.controller");
const authenticate = require("../middlewares/auth.middleware");

router.post("cnt/contribute", authenticate, addProverb);
router.patch("cnt/:contributorId/edit/:proverbId", authenticate, editProverb);
router.delete(
  "cnt/:contributorId/delete/:proverbId",
  authenticate,
  deleteProverb
);
router.get("cnt/:contributorId", authenticate, getProverbs);

module.exports = router;
