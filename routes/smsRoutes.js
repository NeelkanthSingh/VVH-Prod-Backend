const express = require("express");
const router = express.Router();
const { smsController } = require("../controllers/smsController");

router.get("/", smsController.readMssgs);

module.exports = router;