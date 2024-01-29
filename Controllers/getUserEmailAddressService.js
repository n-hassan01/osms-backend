const express = require("express");
const pool = require("../dbConnection");

const router = express.Router();

router.get("/:username", async (req, res, next) => {
  const userName = req.params.username;

  await pool.query(
    "SELECT email_address FROM public.fnd_user WHERE user_name=$1;",
    [userName],
    (error, result) => {
      try {
        if (error) throw error;
        console.log(result.rows);
        res.status(200).send(result.rows[0]);
      } catch (err) {
        console.log(err.message);
        next(err);
      }
    }
  );
});

module.exports = router;
