const express = require("express");
const Joi = require("joi");
const pool = require("../../dbConnection");
const router = express.Router();

// get api for all sales target
router.get("/getAll", async (req, res, next) => {
  await pool.query(
    "SELECT * FROM incentive_distribution_all;",
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
router.get("/getPer/:recipient_groups_id", async (req, res, next) => {
  const recipientGroupsId = req.params.recipient_groups_id;

  await pool.query(
    "SELECT * FROM incentive_distribution_all where recipient_groups_id=$1;",
    [recipientGroupsId],
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
    custGroupId: Joi.number().required(),
    recipientGroupsId: Joi.number().allow(null),
    incentivePct: Joi.number().allow(null),
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
    custGroupId,
    recipientGroupsId,
    incentivePct,
    lastUpdateDate,
    lastUpdatedBy,
    creationDate,
    createdBy,
    lastUpdateLogin,
  } = req.body;

  const date = new Date();

  await pool.query(
    "INSERT INTO incentive_distribution_all(cust_group_id,recipient_groups_id,incentive_pct,last_update_date,  last_updated_by, creation_date, created_by,  last_update_login) VALUES ($1, $2, $3, $4, $5, $6, $7, $8) RETURNING *;",
    [
      custGroupId,
      recipientGroupsId,
      incentivePct,
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

router.put("/update/:recipient_groups_id", async (req, res, next) => {
  const recipientGroupsId = req.params.recipient_groups_id;

  const schema = Joi.object({
    custGroupId: Joi.number().required(),
    recipientGroupsId: Joi.number().allow(null),
    incentivePct: Joi.number().allow(null),
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
    incentivePct,
    lastUpdateDate,
    lastUpdatedBy,
    creationDate,
    createdBy,
    lastUpdateLogin,
  } = req.body;

  const date = new Date();

  await pool.query(
    "UPDATE incentive_distribution_all SET cust_group_id=$1, incentivePct=$2, last_update_date=$3, last_updated_by=$4, creation_date=$5, created_by=$6,  last_update_login=$7 where recipient_groups_id=$8  RETURNING *;",
    [
      custGroupId,
      incentivePct,
      lastUpdateDate,
      lastUpdatedBy,
      creationDate,
      createdBy,
      lastUpdateLogin,
      recipientGroupsId,
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
