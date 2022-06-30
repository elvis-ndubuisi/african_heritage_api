const cors = require("cors");
const corsConfig = require("../config/cors.config");
const limiter = require("../middleware/rateLimiter.middleware");
const router = require("express").Router();
const {
  getAdage,
  queryAdage,
  adageOfTheDay,
} = require("../controllers/adage.controller.js");

router.use(cors(corsConfig.apiCORS));
// router.use(limiter);
router.get("/adage", getAdage);
router.get("/adage/aod", adageOfTheDay);
router.get("/adage/query", queryAdage);

module.exports = router;
