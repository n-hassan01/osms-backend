const express = require("express");
const Joi = require("joi");
const pool = require("../../dbConnection");
const router = express.Router();

// get api for all sales target
router.get("/getAll", async (req, res, next) => {
  await pool.query(
    "SELECT * FROM incentive_recipient_groups;",
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
    "SELECT * FROM incentive_recipient_groups where recipient_groups_id=$1;",
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
    recipientGroupsId: Joi.number().required(),
    recipientGroupsName: Joi.string().max(50),
    lastUpdateDate: Joi.string().min(0),
    lastUpdatedBy: Joi.number().required(),
    creationDate: Joi.string().min(0),
    createdBy: Joi.number().required(),
    lastUpdateLogin: Joi.number().allow(null),
  });

  const validation = schema.validate(req.body);

  if (validation.error) {
    console.log(validation.error.message);

    return res.status(400).send("Invalid inputs");
  }

  const {
    recipientGroupsId,
    recipientGroupsName,
    lastUpdateDate,
    lastUpdatedBy,
    creationDate,
    createdBy,
    lastUpdateLogin,
  } = req.body;

  const date = new Date();

  await pool.query(
    "INSERT INTO incentive_recipient_groups(recipient_groups_id,recipient_groups_name, last_update_date,  last_updated_by, creation_date, created_by,  last_update_login) VALUES ($1, $2, $3, $4, $5, $6, $7) RETURNING *;",
    [
      recipientGroupsId,
      recipientGroupsName,
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
    recipientGroupsName: Joi.string().min(0).max(50),
    lastUpdateDate: Joi.string().min(0),
    lastUpdatedBy: Joi.number().required(),
    creationDate: Joi.string().min(0),
    createdBy: Joi.number().required(),
    lastUpdateLogin: Joi.number().allow(null),
  });

  const validation = schema.validate(req.body);

  if (validation.error) {
    console.log(validation.error);

    return res.status(400).send("Invalid inputs");
  }

  const {
    recipientGroupsName,
    lastUpdateDate,
    lastUpdatedBy,
    creationDate,
    createdBy,
    lastUpdateLogin,
  } = req.body;

  const date = new Date();

  await pool.query(
    "UPDATE incentive_recipient_groups SET recipient_groups_name=$1,  last_update_date=$2, last_updated_by=$3, creation_date=$4, created_by=$5,  last_update_login=$6 where recipient_groups_id=$7  RETURNING *;",
    [
      recipientGroupsName,
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
