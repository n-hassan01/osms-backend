const express = require("express");
const pool = require("../dbConnection");
const router = express.Router();

router.get("/:id", async (req, res, next) => {
  const id = req.params.id;
  await pool.query(
    "SELECT id,otp FROM otp WHERE id = $1",
    [id],
    (error, result) => {
      try {
        if (error) throw error;

        res.status(200).json(result.rows[0]);
      } catch (err) {
        next(err);
      }
    }
  );
});

module.exports = router;
