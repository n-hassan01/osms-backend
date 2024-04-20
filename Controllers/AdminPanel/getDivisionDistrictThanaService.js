const express = require("express");
const pool = require("../../dbConnection");
const router = express.Router();

router.get("/division", async (req, res, next) => {
  await pool.query(
    "SELECT * FROM division",

    (error, result) => {
      try {
        if (error) throw error;

        res.status(200).json(result.rows);
      } catch (err) {
        next(err);
      }
    }
  );
});

router.get("/district", async (req, res, next) => {
  await pool.query("SELECT * FROM district", (error, result) => {
    try {
      if (error) throw error;

      res.status(200).json(result.rows);
    } catch (err) {
      next(err);
    }
  });
});

router.get("/thana", async (req, res, next) => {
  await pool.query("SELECT * FROM thana", (error, result) => {
    try {
      if (error) throw error;

      res.status(200).json(result.rows);
    } catch (err) {
      next(err);
    }
  });
});

module.exports = router;
