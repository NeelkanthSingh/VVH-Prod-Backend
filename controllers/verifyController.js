const verifyController = {};

verifyController.verifyToken = (req, res) => {
    res.json({
        isAuthenticated: true,
        username: req.username,
        email: req.email
    })
}

module.exports = { verifyController };