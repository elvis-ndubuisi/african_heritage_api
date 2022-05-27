const router = require("express").Router();
const { getAdage, queryAdage } = require("../controllers/api.controller.js");

router.get("/adage", getAdage);
router.get("/adage/query", queryAdage);

module.exports = router;
