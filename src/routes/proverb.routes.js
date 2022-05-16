const router = require("express").Router();
const {
  addProverb,
  editProverb,
  deleteProverb,
  getProverbs,
} = require("../controllers/proverb.controller");
const authenticate = require("../middlewares/auth.middleware");

router.post("/proverb/contribute", authenticate, addProverb);
router.patch("/proverb/:contributorId/edit", authenticate, editProverb);
router.delete("/proverb/:contributorId/delete", authenticate, deleteProverb);
router.get("/proverb/:contributorId", authenticate, getProverbs);

module.exports = router;
