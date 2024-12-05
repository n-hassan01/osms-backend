const express = require("express");
const Joi = require("joi");
const pool = require("../../dbConnection");
const router = express.Router();

// get api for all sales target
router.get("/getAll", async (req, res, next) => {
  await pool.query(
    "SELECT * FROM incentive_achievement_slab_all;",
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

// get api for specific sales target
router.get("/getPer/:achievement_range_id", async (req, res, next) => {
  const achievementRangeId = req.params.achievement_range_id;

  await pool.query(
    "SELECT * FROM incentive_achievement_slab_all where achievement_range_id=$1;",
    [achievementRangeId],
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

// add sales target api
router.post("/add", async (req, res, next) => {
  const schema = Joi.object({
    achievementRangeId: Joi.number().required(),
    custGroupId: Joi.number().required(),
    achievementStartPct: Joi.number().allow(null),
    achievementEndPct: Joi.number().allow(null),
    totalIncentivePct: Joi.number().allow(null),
    lastUpdateDate: Joi.string().required(),
    lastUpdatedBy: Joi.number().required(),
    creationDate: Joi.string().required(),
    createdBy: Joi.number().required(),
    lastUpdateLogin: Joi.number().allow(null),
  });

  const validation = schema.validate(req.body);

  if (validation.error) {
    console.log(validation.error.message);

    return res.status(400).send("Invalid inputs");
  }

  const {
    achievementRangeId,
    custGroupId,
    achievementStartPct,
    achievementEndPct,
    totalIncentivePct,
    lastUpdateDate,
    lastUpdatedBy,
    creationDate,
    createdBy,
    lastUpdateLogin,
  } = req.body;

  const date = new Date();

  await pool.query(
    "INSERT INTO incentive_achievement_slab_all(achievement_range_id,cust_group_id,achievement_start_pct,achievement_end_pct,total_incentive_pct, last_update_date,  last_updated_by, creation_date, created_by,  last_update_login) VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10) RETURNING *;",
    [
      achievementRangeId,
      custGroupId,
      achievementStartPct,
      achievementEndPct,
      totalIncentivePct,
      lastUpdateDate,
      lastUpdatedBy,
      creationDate,
      createdBy,
      lastUpdateLogin,
    ],
    (error, result) => {
      try {
        if (error) throw error;

        return res
          .status(200)
          .json({ message: "Successfully added!", headerInfo: result.rows });
      } catch (err) {
        next(err);
      }
    }
  );
});

router.put("/update/:achievement_range_id", async (req, res, next) => {
  const achievementRangeId = req.params.achievement_range_id;

  const schema = Joi.object({
    custGroupId: Joi.number().required(),
    achievementStartPct: Joi.number().allow(null),
    achievementEndPct: Joi.number().allow(null),
    totalIncentivePct: Joi.number().allow(null),
    lastUpdateDate: Joi.string().required(),
    lastUpdatedBy: Joi.number().required(),
    creationDate: Joi.string().required(),
    createdBy: Joi.number().required(),
    lastUpdateLogin: Joi.number().allow(null),
  });

  const validation = schema.validate(req.body);

  if (validation.error) {
    console.log(validation.error);

    return res.status(400).send("Invalid inputs");
  }

  const {
    custGroupId,
    achievementStartPct,
    achievementEndPct,
    totalIncentivePct,
    lastUpdateDate,
    lastUpdatedBy,
    creationDate,
    createdBy,
    lastUpdateLogin,
  } = req.body;

  const date = new Date();

  await pool.query(
    "UPDATE incentive_achievement_slab_all SET cust_group_id=$1, achievement_start_pct=$2,achievement_end_pct=$3,total_incentive_pct=$4, last_update_date=$5, last_updated_by=$6, creation_date=$7, created_by=$8,  last_update_login=$9 where achievement_range_id=$10  RETURNING *;",
    [
      custGroupId,
      achievementStartPct,
      achievementEndPct,
      totalIncentivePct,
      lastUpdateDate,
      lastUpdatedBy,
      creationDate,
      createdBy,
      lastUpdateLogin,
      achievementRangeId,
    ],
    (error, result) => {
      try {
        if (error) throw error;

        return res
          .status(200)
          .json({ message: "Successfully updated!", headerInfo: result.rows });
      } catch (err) {
        next(err);
      }
    }
  );
});

module.exports = router;
