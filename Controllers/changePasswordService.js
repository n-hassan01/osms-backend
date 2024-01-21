const express = require("express");
const bcrypt = require("bcrypt");
const pool = require("../dbConnection");
const router = express.Router();

router.put("/", async (req, res, next) => {
  const { newPassword } = req.body;

  // Hash the password
  const hashedPassword = await bcrypt.hash(newPassword, 10);
  console.log(hashedPassword);

  await pool.query(
    "UPDATE public.fnd_user SET user_password=$1 WHERE user_name=$2;",
    [hashedPassword, req.id],
    (error, result) => {
      try {
        if (error) throw error;

        res.status(200).json({ message: "Password changed!" });
      } catch (err) {
        next(err);
      }
    }
  );
});

module.exports = router;
