const router = require("express").Router();
router.get("/test", (req, res) => {
  res.send("test get");
});
router.post("/test", (req, res) => {
  res.send("test post");
});

module.exports = router;
