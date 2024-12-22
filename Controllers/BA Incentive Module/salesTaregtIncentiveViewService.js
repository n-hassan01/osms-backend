const express = require("express");
const Joi = require("joi");
const pool = require("../../dbConnection");
const router = express.Router();

// get api for all sales target
router.get("/", async (req, res, next) => {
  await pool.query(
    "SELECT * FROM so_sale_target_incentive_v;",
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

router.get("/:emp_code", async (req, res, next) => {
  const empCode = req.params.emp_code;

  await pool.query(
    "SELECT * FROM so_sale_target_incentive_v where emp_code=$1;",
    [empCode],
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

module.exports = router;
