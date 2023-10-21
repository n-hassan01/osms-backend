const express = require("express");
const app = express();
const router = express.Router();
const transporter = require("../Configurations/transporter");

const sendOtpMiddleware = router.get("/", async (req, res, next) => {
 
  function generateOTP() {
    return Math.floor(100000 + Math.random() * 900000).toString();
  }

  try {
    //console.log(response + "response");

    const email = "alifahmedraihan@gmail.com";
    console.log(email + "email");
    const otpp = generateOTP();

    console.log(otpp + "otp");
    passotp = otpp;
    compareOtpp = otpp;
    console.log("Generate OTP : " + compareOtpp);

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

    // res.json({ message: "OTP sent successfully" });
    req.generatedOtp = otpp;
    next();
    // return otp;
  } catch (error) {
    next(error);
    // res.json({ message: 'Internal Server Error' });
    //res.status(500).json({ error: 'Internal Server Error' });
  }
});

module.exports = sendOtpMiddleware;
