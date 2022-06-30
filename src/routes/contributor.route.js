const cors = require("cors");
const corsConfig = require("../config/cors.config");
const router = require("express").Router();
const {
  addAdage,
  editAdage,
  deleteAdage,
  editProfile,
  getAdages,
  postBatchAdage,
} = require("../controllers/contributor.controller");
const { verifyAccessToken } = require("../helpers/jwt_auth");

router.use(cors(corsConfig.contributorCORS));
router.use(verifyAccessToken);
router.patch("/", editProfile);
router.get("/adages", getAdages);
router.post("/batch/adages", postBatchAdage);
router.post("/adage", addAdage);
router.patch("/adage", editAdage);
router.delete("/adage", deleteAdage);

module.exports = router;
