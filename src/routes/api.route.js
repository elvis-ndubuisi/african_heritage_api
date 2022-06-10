const cors = require("cors");
const corsConfig = require("../config/cors.config");
const router = require("express").Router();
const {
  getAdage,
  queryAdage,
  adageOfTheDay,
} = require("../controllers/api.controller.js");

// router.use(cors(corsConfig.apiCORS));
router.get("/adage", getAdage);
router.get("/adage/aod", adageOfTheDay);
router.get("/adage/query", queryAdage);

module.exports = router;
