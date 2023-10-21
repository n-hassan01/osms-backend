const express = require("express");
const pool = require("../dbConnection");

const router = express.Router();

const transporter=require("../Configurations/transporter");

var compareotpp;
function generateOTP() {
  return Math.floor(100000 + Math.random() * 900000).toString();
}



router.get("/", async (req, res, next) => {


try {
  
    console.log(response + "response");

    const email = "alifahmedraihan@gmail.com";
    console.log(email + "email");
    const otpp = generateOTP();
    console.log(otpp + "otp");
    compareOtpp = otpp;
    console.log("compareotp" + compareOtpp);

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
    // return otp;
  } catch (error) {
    console.error("Error sending OTP:", error);
    // res.json({ message: 'Internal Server Error' });
    //res.status(500).json({ error: 'Internal Server Error' });
  }
});

module.exports = router;