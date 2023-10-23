const express = require("express");
const pool = require("../dbConnection");
const router = express.Router();

router.post("/", async (req, res, next) => {
  try {
    const { id, otp } = req.body;
    let countExistUserId;
    const result = await pool.query("SELECT COUNT(*) FROM otp WHERE id = $1", [
      id,
    ]);
    countExistUserId = result.rows[0].count;
    if (countExistUserId === "0") {
      await pool.query("INSERT INTO otp(id, otp) VALUES ($1, $2)", [id, otp]);
    } else {
      await pool.query("UPDATE otp SET otp = $1 WHERE id = $2", [otp, id]);
    }
    res.status(200).json({ message: "Successfully completed" });
  } catch (error) {
    next({ message: "Error processing the request" });
  }
});

module.exports = router;
