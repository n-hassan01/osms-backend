const express = require("express");
const router = express.Router();
const transporter = require("../Configurations/transporter");

function generateOTP() {
  return Math.floor(100000 + Math.random() * 900000).toString();
}
router.post("/", async (req, res, next) => {
  try {
    const email = req.body.email;
    console.log(email);
    const otpp = generateOTP();

    // Create an email message
    const mailOptions = {
      from: "ahmedraihanalif@gmail.com",
      to: email,
      subject: "Your OTP Code",
      text: `Your OTP code is: ${otpp}`,
    };

    // Send the email
    await transporter.sendMail(mailOptions);

    // You can save the OTP in a database for validation later
    res.json({ message: "OTP sent successfully" });
  } catch (error) {
    console.error("Error sending OTP:", error);
  }
});

module.exports = router;
