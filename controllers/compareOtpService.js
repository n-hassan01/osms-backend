const express = require("express");
const pool = require("../dbConnection");
const router = express.Router();
const bcrypt = require("bcrypt");

router.post("/", async (req, res, next) => {
  const { verificationCode, id, password } = req.body;

  let generatedOtp;
  try {
    const result = await pool.query("SELECT id, otp FROM otp WHERE id = $1", [
      id,
    ]);
    if (result.rows.length > 0) {
      generatedOtp = result.rows[0].otp;
    } else {
      res.status(404).json({ message: "OTP not found" });
    }
  } catch (error) {
    next(error);
  }
  const hashedPassword = await bcrypt.hash(password, 10);

  if (verificationCode === generatedOtp) {
    await pool.query(
      'insert into "user"(id, password, status) values($1, $2, $3) RETURNING *',
      [id, hashedPassword, "approved"],
      (error, result) => {
        if (error) {
          throw error;
        }

        res.status(200).json({ message: "Signup completed!" });
      }
    );
  } else {
    next("Invalid otp!");
  }
});

module.exports = router;
