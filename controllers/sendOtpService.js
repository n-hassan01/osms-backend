const express = require("express");
const router = express.Router();
const nodemailer = require("nodemailer");
const pool = require("../dbConnection");

function generateOTP() {
  return Math.floor(100000 + Math.random() * 900000).toString();
}

router.post("/", async (req, res, next) => {
  const { email, userId } = req.body;
  const otp = generateOTP();

  const transporter = nodemailer.createTransport({
    host: "smtp.gmail.com",
    port: 465, // Use port 465 for SMTP with SSL/TLS
    secure: true, // Enable SSL/TLS
    auth: {
      user: "ahmedraihanalif@gmail.com",
      pass: "xrkv mokm rbrz zqpb",
    },
  });

  const mailOptions = {
    from: "ahmedraihanalif@gmail.com",
    to: email,
    subject: "Your OTP Code",
    text: `Your OTP code is: ${otp}`,
  };

  try {
    // Send mail
    const info = await transporter.sendMail(mailOptions);
    console.log("Email sent: ", info.response);

    // Database queries
    const result = await pool.query("SELECT COUNT(*) FROM otp WHERE id = $1", [
      userId,
    ]);
    const countExistUserId = result.rows[0].count;

    if (countExistUserId === "0") {
      await pool.query("INSERT INTO otp(id, otp) VALUES ($1, $2)", [
        userId,
        otp,
      ]);
    } else {
      await pool.query("UPDATE otp SET otp = $1 WHERE id = $2", [otp, userId]);
    }

    res.status(200).json({ message: "OTP sent successfully" });
  } catch (error) {
    console.error("Error sending email or updating database:", error);
    next(error);
  }
});

module.exports = router;
