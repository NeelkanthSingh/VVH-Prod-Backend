const smsController = {};

smsController.readMssgs = (req, res) => {
    console.log("Reading messages");
    console.log("Message: ", mssg);
    console.log("Phone: ", phone);
    res.json({
        message: "Read messages"
    })
}

module.exports = { smsController };