const express = require("express");
const router = express.Router();
const { documentController } = require("../controllers/documentController");
const { AuthMiddleware } = require("../middleware");

router.get("/getAll", AuthMiddleware, documentController.getAllDocuments);
module.exports = router;