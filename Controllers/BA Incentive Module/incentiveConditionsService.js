const express = require("express");
const pool = require("../../dbConnection");
const router = express.Router();

router.get("/", async (req, res, next) => {
  try {
    await pool.query(
      "SELECT * FROM public.incentive_conditions;",
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
    parentIncentiveTypeId,
    lastUpdateDate,
    lastUpdatedBy,
    creationDate,
    createdBy,
  } = req.body;
  try {
    await pool.query(
      "INSERT INTO public.incentive_conditions(incentive_type_id, parent_incentive_type_id,last_update_date,last_updated_by,creation_date,created_by) VALUES ($1, $2,$3,$4,$5,$6);",
      [
        incentiveTypeId,
        parentIncentiveTypeId,
        lastUpdateDate,
        lastUpdatedBy,
        creationDate,
        createdBy,
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
