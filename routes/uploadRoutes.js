const express = require("express");
const multer = require("multer");
const router = express.Router();
const { uploadController } = require("../controllers/uploadController");
const { AuthMiddleware } = require("../middleware");

// Configure multer to handle file uploads
const storage = multer.diskStorage({
    destination: function (req, file, cb) {
        cb(null, "../uploads/"); // Specify the destination folder for uploaded files
    },
    filename: function (req, file, cb) {
        // Constructing the filename with desired name and extension
        const filename = req.body.name; // Assuming the name is sent in the request body
        const extension = file.originalname.split('.').pop(); // Extracting the original file extension
        req.body.extension = extension; // Storing the extension in the request body
        cb(null, `${filename}.${extension}`); // Set the filename with desired extension
    }
});
const upload = multer({ storage: storage });

router.post("/file", upload.single("file"), AuthMiddleware , uploadController.fileUpload);

module.exports = router;