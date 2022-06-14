const router = require("express").Router();
const {
  getAdage,
  queryAdage,
  adageOfTheDay,
} = require("../controllers/adage.controller.js");

router.get("/adage", getAdage);
router.get("/adage/aod", adageOfTheDay);
router.get("/adage/query", queryAdage);

module.exports = router;