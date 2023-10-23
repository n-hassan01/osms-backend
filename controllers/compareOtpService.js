const express = require("express");
const pool = require("../dbConnection");
const router = express.Router();

router.post("/", async (req, res, next) => {
  const { verificationCode, generatedOtpp, id, password } = req.body;
  const hashedPassword = await bcrypt.hash(password, 10);

  if (verificationCode === generatedOtpp) {
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
