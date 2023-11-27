const express = require("express");
const pool = require("../dbConnection");
const router = express.Router();
const bcrypt = require("bcrypt");

router.post("/", async (req, res, next) => {
  const { verificationCode, id, password } = req.body;

  let generatedOtp;
  try {
    const result = await pool.query("SELECT otp FROM otp WHERE id = $1", [id]);
    if (result.rows.length > 0) {
      generatedOtp = result.rows[0].otp;
    } else {
      res.status(404).json({ message: "OTP not found" });
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    if (verificationCode === generatedOtp) {
      const currentDate = new Date().toJSON();

      await pool.query(
        'insert into "fnd_user"(user_name, user_password, start_date, status) values($1, $2, $3, $4) RETURNING *',
        [id, hashedPassword, currentDate, "approved"],
        (error, result) => {
          if (error) {
            throw error;
          }

          res.status(200).json({ message: "OTP matched!" });
        }
      );
    } else {
      next("Invalid otp!");
    }
  } catch (error) {
    next(error);
  }
});

module.exports = router;
