const express = require("express");
const router = express.Router();
const { authController } = require("../controllers/authController");
const { RefreshTokenCheck, AuthMiddleware } = require("../middleware");

router.get("/", authController.checkUser);
router.get("/logout", RefreshTokenCheck, authController.logoutUser);
router.get("/refresh", RefreshTokenCheck, authController.refreshToken);
router.get("/google", authController.generateAuthUrl);

module.exports = router;
