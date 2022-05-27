const router = require("express").Router();
const { getAdage } = require("../controllers/api.controller.js");

router.get("/adage", getAdage);

module.exports = router;
