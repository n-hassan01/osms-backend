const express = require("express");
const router = express.Router();
const nodemailer = require("nodemailer");
const pool = require("../dbConnection");

function generateOTP() {
  return Math.floor(100000 + Math.random() * 900000).toString();
}
router.post("/", async (req, res, next) => {
  // try {
  const { email, userId } = req.body;
  const otp = generateOTP();

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
    text: `Your OTP code is: ${otp}`,
  };

  try {
    await transporter.sendMail(mailOptions, (error, info) => {
      if (error) throw error;

      console.log("Email sent: ", info.response);
    });

    pool.query(
      "SELECT COUNT(*) FROM otp WHERE id = $1",
      [userId],
      (error, result) => {
        if (error) throw error;

        const countExistUserId = result.rows[0].count;
        if (countExistUserId === "0") {
          pool.query(
            "INSERT INTO otp(id, otp) VALUES ($1, $2)",
            [userId, otp],
            (error, result) => {
              try {
                if (error) throw error;
              } catch (err) {
                next(err);
              }
            }
          );
        } else {
          pool.query(
            "UPDATE otp SET otp = $1 WHERE id = $2",
            [otp, userId],
            (error, result) => {
              try {
                if (error) throw error;
              } catch (err) {
                next(err);
              }
            }
          );
        }
        res.status(200).json({ message: "OTP sent successfully" });
      }
    );
  } catch (error) {
    console.log('abc');
    next(error);
  }
});

module.exports = router;
