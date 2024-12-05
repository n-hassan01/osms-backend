const express = require("express");
const pool = require("../../dbConnection");
const router = express.Router();

router.get("/", async (req, res, next) => {
  try {
    await pool.query(
      "SELECT * FROM public.incentive_recipient_groups;",
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
    recipientGroupsId,
    recipientGroupsName,
    lastUpdateDate,
    LastUpdatedBy,
    creationDate,
    createdBy,
    lastUpdateLogin,
  } = req.body;
  try {
    await pool.query(
      "INSERT INTO public.incentive_recipient_groups(incentive_type_id, parent_incentive_type_id) VALUES ($1, $2, $3, $4, $5, $6, $7);",
      [
        recipientGroupsId,
        recipientGroupsName,
        lastUpdateDate,
        LastUpdatedBy,
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
