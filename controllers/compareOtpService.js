const express = require("express");
const pool = require("../dbConnection");
const router = express.Router();
const bcrypt = require("bcrypt");

router.post("/", async (req, res, next) => {
  const { verificationCode, id, password } = req.body;

  try {
    const result = await pool.query("SELECT otp FROM otp WHERE id = $1", [id]);

    if (result.rows.length === 0) {
      return res.status(404).json({ message: "OTP not found" });
    }

    const generatedOtp = result.rows[0].otp;
    const isOtpValid = await bcrypt.compare(verificationCode, generatedOtp);

    if (isOtpValid) {
      const currentDate = new Date().toJSON();

      const insertQuery =
        'INSERT INTO "fnd_user" (user_name, user_password, start_date, status) VALUES ($1, $2, $3, $4) RETURNING *';

      const insertedUser = await pool.query(insertQuery, [
        id,
        password,
        currentDate,
        "approved",
      ]);

      res
        .status(200)
        .json({ message: "OTP matched!", user: insertedUser.rows[0] });
    } else {
      return res.status(401).json({ message: "Invalid OTP" });
    }
  } catch (error) {
    next(error);
  }
});

module.exports = router;
