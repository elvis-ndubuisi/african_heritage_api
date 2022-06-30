const router = require("express").Router();
const {
  genAuthLink,
  verifyCallback,
  autoPostTweet,
} = require("../controllers/tweet.controller");

// router.route("/tweet").get("/", genAuthLink).get("/callback", verifyCallback);
router.get("/", genAuthLink);
router.get("/callback", verifyCallback);
router.post("/autopost", autoPostTweet);

module.exports = router;
