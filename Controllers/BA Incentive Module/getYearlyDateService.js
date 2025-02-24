const express = require("express");
const pool = require("../../dbConnection");
const router = express.Router();

router.get("/", async (req, res, next) => {
  await pool.query("SELECT * FROM d_yearly_dates;", (error, result) => {
    try {
      if (error) throw error;

      res.status(200).json(result.rows);
    } catch (err) {
      next(err);
    }
  });
});

router.get("/view", async (req, res, next) => {
  await pool.query("SELECT * FROM d_yearly_dates_v;", (error, result) => {
    try {
      if (error) throw error;

      res.status(200).json(result.rows);
    } catch (err) {
      next(err);
    }
  });
});

module.exports = router;
