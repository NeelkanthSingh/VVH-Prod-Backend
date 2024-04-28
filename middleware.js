const jwt = require("jsonwebtoken")
const { JWT_SECRET } = require("./config")

const AuthMiddleware = function(req, res, next) {
    const authHeader = req.headers.authorization

    if (!authHeader || !authHeader.startsWith('Bearer ')) {
        return res.status(401).json({});
    }

    const token = authHeader.split(" ")[1]

    try {
        const decoded = jwt.verify(token, JWT_SECRET);
        if(decoded.token_type != "ACCESS")
            throw new Error("Token type is not access");

        req.email = decoded.email;
        req.username = decoded.username;
        req.token_type = decoded.token_type;
        next();
    } catch (err) {
        return res.status(403).json({});
    }
}

const RefreshTokenCheck = function(req, res, next) {
    const authHeader = req.cookies

    if (!authHeader?.jwtToken) {
        return res.status(401).json({});
    }

    const token = authHeader.jwtToken

    try {
        const decoded = jwt.verify(token, JWT_SECRET);
        if(decoded.token_type != "REFRESH")
            throw new Error("Not a refresh token");
        
        req.email = decoded.email;
        req.username = decoded.username
        next();
    } catch (err) {
        res.clearCookie('jwtToken')
        return res.status(403).json({});
    }
}


module.exports = {
    AuthMiddleware,
    RefreshTokenCheck
}