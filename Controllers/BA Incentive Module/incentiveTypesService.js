const express = require("express");
const pool = require("../../dbConnection");
const router = express.Router();

router.get("/", async (req, res, next) => {
  try {
    await pool.query(
      "SELECT * FROM public.incentive_types;",
      (error, result) => {
        try {
          if (error) throw error;

          res.status(200).json(result.rows);
        } catch (err) {
          next(err);
        }
      }
    );
  } catch (err) {
    next(err);
  }
});

router.post("/add", async (req, res, next) => {
  const { incentiveTypeId, incentiveType, incentiveDesc } = req.body;
  try {
    await pool.query(
      "INSERT INTO public.incentive_types(incentive_type_id, incentive_type, incentive_desc) VALUES ($1, $2, $3);",
      [incentiveTypeId, incentiveType, incentiveDesc],
      (error, result) => {
        try {
          if (error) throw error;

          res.status(200).json(result.rows);
        } catch (err) {
          next(err);
        }
      }
    );
  } catch (err) {
    next(err);
  }
});

module.exports = router;
