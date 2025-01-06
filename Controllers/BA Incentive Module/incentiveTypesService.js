const express = require("express");
const pool = require("../../dbConnection");
const router = express.Router();

router.get("/getAll", async (req, res, next) => {
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
  const {
    incentiveTypeId,
    incentiveType,
    incentiveDesc,
    lastUpdateDate,
    lastUpdatedBy,
    creationDate,
    createdBy,
    lastUpdateLogin,
  } = req.body;
  try {
    await pool.query(
      "INSERT INTO public.incentive_types(incentive_type_id, incentive_type, incentive_desc,last_update_date,last_updated_by,creation_date,created_by,last_update_login) VALUES ($1, $2, $3, $4, $5, $6, $7, $8);",
      [
        incentiveTypeId,
        incentiveType,
        incentiveDesc,
        lastUpdateDate,
        lastUpdatedBy,
        creationDate,
        createdBy,
        lastUpdateLogin,
      ],

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
