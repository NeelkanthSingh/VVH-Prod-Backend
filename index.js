const express = require("express");
const cors = require("cors");
const cookieParser = require('cookie-parser');
const dotenv = require("dotenv")
const app = express();
dotenv.config()

const authRoutes = require("./routes/authRoutes");
const googleRoutes = require("./routes/googleRoutes");
const uploadRoutes = require("./routes/uploadRoutes");
const verifyRoutes = require("./routes/verifyRoutes");
const documentRoutes = require("./routes/documentRoutes");
const smsRoutes = require("./routes/smsRoutes");
const corsOptions = require("./config/corsOption");

app.use(cookieParser());
app.use(cors(corsOptions));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.use("/auth", authRoutes);
app.use("/google", googleRoutes);
app.use("/upload", uploadRoutes);
app.use("/verify", verifyRoutes);
app.use("/docs", documentRoutes);
app.use("/sms", smsRoutes);     

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
    console.log(`The server is listening on PORT: ${PORT}`);
});