const express = require("express");
const Joi = require("joi");
const pool = require("../../dbConnection");
const router = express.Router();

// get api for all sales target
router.get("/getAll", async (req, res, next) => {
  await pool.query("SELECT * FROM sales_targets_all;", (error, result) => {
    try {
      if (error) throw error;

      res.status(200).json(result.rows);
    } catch (err) {
      next(err);
    }
  });
});

// get api for specific sales target
router.get("/getPer/:cust_account_id", async (req, res, next) => {
  const customerAccountId = req.params.cust_account_id;

  await pool.query(
    "SELECT * FROM sales_targets_all where cust_account_id=$1;",
    [customerAccountId],
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
    custAccountId: Joi.number().required(),
    lastUpdateDate: Joi.string().min(0),
    lastUpdatedBy: Joi.number().required(),
    creationDate: Joi.string().min(0),
    createdBy: Joi.number().required(),
    lastUpdateLogin: Joi.number().allow(null),
    custgroupid: Joi.number().allow(null),
    startDate: Joi.string().min(0),
    endDate: Joi.string().min(0),
    amount: Joi.number().allow(null),
  });

  const validation = schema.validate(req.body);

  if (validation.error) {
    console.log(validation.error.message);

    return res.status(400).send("Invalid inputs");
  }

  const {
    custAccountId,
    lastUpdatedBy,
    creationDate,
    createdBy,
    lastUpdateLogin,
    custgroupid,
    startDate,
    endDate,
    amount,
  } = req.body;

  const date = new Date();

  await pool.query(
    "INSERT INTO sales_targets_all(cust_account_id, last_update_date,  last_updated_by, creation_date, created_by,  last_update_login, cust_group_id, start_date, end_date, amount) VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10) RETURNING *;",
    [
      custAccountId,
      date,
      lastUpdatedBy,
      creationDate,
      createdBy,
      lastUpdateLogin,
      custgroupid,
      startDate,
      endDate,
      amount,
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

router.put("/update/:cust_account_id", async (req, res, next) => {
  const custAccountId = req.params.cust_account_id;

  const schema = Joi.object({
    lastUpdateDate: Joi.string().min(0),
    lastUpdatedBy: Joi.number().required(),
    creationDate: Joi.string().min(0),
    createdBy: Joi.number().required(),
    lastUpdateLogin: Joi.number().allow(null),
    custgroupid: Joi.number().allow(null),
    startDate: Joi.string().min(0),
    endDate: Joi.string().min(0),
    amount: Joi.number().allow(null),
  });

  const validation = schema.validate(req.body);

  if (validation.error) {
    console.log(validation.error);

    return res.status(400).send("Invalid inputs");
  }

  const {
    lastUpdatedBy,
    creationDate,
    createdBy,
    lastUpdateLogin,
    custgroupid,
    startDate,
    endDate,
    amount,
  } = req.body;

  const date = new Date();

  await pool.query(
    "UPDATE sales_targets_all SET last_update_date=$1,  last_updated_by=$2, creation_date=$3, created_by=$4,  last_update_login=$5, cust_group_id=$6, start_date=$7, end_date=$8, amount=$9 where cust_account_id=$10  RETURNING *;",
    [
      date,
      lastUpdatedBy,
      creationDate,
      createdBy,
      lastUpdateLogin,
      custgroupid,
      startDate,
      endDate,
      amount,
      custAccountId,
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
