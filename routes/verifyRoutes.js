const express = require("express");
const router = express.Router();
const { verifyController } = require("../controllers/verifyController");
const { AuthMiddleware } = require("../middleware")

router.get("/token", AuthMiddleware, verifyController.verifyToken);

module.exports = router;
