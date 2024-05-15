const express = require("express");
const router = express.Router();
const { smsController } = require("../controllers/smsController");

router.post("/", smsController.readMssgs);
router.get("/getall", smsController.displayMssgs);

module.exports = router;