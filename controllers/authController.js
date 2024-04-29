const { user } = require("../db");
const { oauth2Client } = require("../drive");
const jwt = require("jsonwebtoken")
const { JWT_SECRET } = require("../config")
const authController = {};

authController.checkUser = async (req, res) => {
    const email = req.query.email;
    const isUser = await user.findOne({ email: email });
    if (isUser != null) {
        res.status(200).json({
            firstUser: false,
            username: isUser.username
        });
    } else {
        res.status(200).json({
            firstUser: true,
            username: undefined
        });
    }
};

authController.logoutUser = async (req, res) => {
    console.log("Logging out user");
    res.clearCookie('jwtToken', { httpOnly: true, sameSite: 'lax', secure: true});
    return res.sendStatus(204);
};

authController.refreshToken = async (req, res) => {
    const accessToken = jwt.sign({  email: req.email, username: req.username, token_type: "ACCESS" }, JWT_SECRET, { expiresIn: '15m' });
    res.status(201).json({accessToken});
};

authController.generateAuthUrl = (req, res) => {
    const url = oauth2Client.generateAuthUrl({
        access_type: "offline",
        scope: ["https://www.googleapis.com/auth/userinfo.email",
            "https://www.googleapis.com/auth/userinfo.profile",
            "https://www.googleapis.com/auth/drive"]
    });
    res.redirect(url);
};


module.exports = { authController };
