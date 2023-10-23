const express = require("express");
const router = express.Router();
const nodemailer = require('nodemailer');

function generateOTP() {
  return Math.floor(100000 + Math.random() * 900000).toString();
}
router.post("/", async (req, res, next) => {
  try {
    const email = req.body.email;
    const otpp = generateOTP();

    const transporter = nodemailer.createTransport({
      service: "gmail",
      host: "smtp.gmail.com",
      port: 587,
      secure: false,
      auth: {
        user: "ahmedraihanalif@gmail.com",
        pass: "xrkv mokm rbrz zqpb",
      },
    });

    const mailOptions = {
      from: "ahmedraihanalif@gmail.com",
      to: email,
      subject: "Your OTP Code",
      text: `Your OTP code is: ${otpp}`,
    };

    transporter.sendMail(mailOptions, (error, info) => {
      if (error) throw error;

      console.log("Email sent: ", info.response);
    });

    res.json({ message: "OTP sent successfully" });
  } catch (error) {
    next(error);
  }
});

module.exports = router;
