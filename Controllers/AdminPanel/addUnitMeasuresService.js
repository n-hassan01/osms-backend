const express = require("express");
const pool = require("../dbConnection");
const router = express.Router();

router.post("/", async (req, res, next) => {
  try {
    const { id, otp } = req.body;
    let countExistUserId;
    const result = await pool.query(
      "SELECT COUNT(*) FROM otp WHERE id = $1",
      [id],
      (error, result) => {
        try {
          if (error) throw error;
          countExistUserId = result.rows[0].count;
          if (countExistUserId === "0") {
            pool.query(
              "INSERT INTO otp(id, otp) VALUES ($1, $2)",
              [id, otp],
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
              [otp, id],
              (error, result) => {
                try {
                  if (error) throw error;
                } catch (err) {
                  next(err);
                }
              }
            );
          }
          res.status(200).json({ message: "Successfully completed" });
        } catch (err) {
          next(err);
        }
      }
    );
  } catch (error) {
    next(error);
  }
});

module.exports = router;
