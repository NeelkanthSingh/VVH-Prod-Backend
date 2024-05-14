const smsController = {};

smsController.readMssgs = (req, res) => {
    console.log("Reading messages");
    const mssg = req.body.sms_message;
    const phone = req.body.sender_phone_number;

    console.log("Message: ", mssg);
    console.log("Phone: ", phone);
    res.json({
        message: "Read messages"
    })
}

module.exports = { smsController };