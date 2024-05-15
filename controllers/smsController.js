const smsController = {};
const { sms } = require("../db");

smsController.readMssgs = async (req, res) => {
    console.log("Reading messages");
    const mssg = req.body.sms_message;
    const phone = req.body.sender_phone_number;

    await sms.create({
        phone_number: phone,
        message: mssg
    });
    
    res.json({
        message: "Stored message"
    })
}

smsController.displayMssgs = async (req, res) => {
    console.log("Displaying messages");
    const allMssgs = await sms.find({});
    res.json({
        message: "All messages",
        data: allMssgs
    })
}

module.exports = { smsController };