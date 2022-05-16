const router = require("express").Router();
const {
  addProverb,
  editProverb,
  deleteProverb,
} = require("../controllers/proverb.controller");

router.post("/contribute", addProverb);

module.exports = router;
