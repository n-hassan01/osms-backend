const express = require("express");
const Joi = require("joi");
const pool = require("../../dbConnection");
const router = express.Router();

// get api for all sales target
router.get("/getAll", async (req, res, next) => {
  await pool.query("SELECT * FROM sales_targets_sku_all;", (error, result) => {
    try {
      if (error) throw error;

      res.status(200).json(result.rows);
    } catch (err) {
      next(err);
    }
  });
});

// get api for specific sales target
router.get("/getPer/:incentive_type_id", async (req, res, next) => {
  const incentiveTypeId = req.params.incentive_type_id;

  await pool.query(
    "SELECT * FROM sales_targets_sku_all where incentive_type_id=$1;",
    [incentiveTypeId],
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
    incentiveTypeId: Joi.number().required(),
    custAccountId: Joi.number().required(),
    custgroupid: Joi.number().allow(null),
    startDate: Joi.string().min(0),
    endDate: Joi.string().min(0),
    inventoryItemId: Joi.number().required(),
    amount: Joi.number().allow(null),
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
    incentiveTypeId,
    custAccountId,
    custgroupid,
    startDate,
    endDate,
    inventoryItemId,
    amount,
    lastUpdateDate,
    lastUpdatedBy,
    creationDate,
    createdBy,
    lastUpdateLogin,
  } = req.body;

  const date = new Date();

  await pool.query(
    "INSERT INTO sales_targets_sku_all(incentive_type_id,cust_account_id,cust_group_id,start_date,end_date,inventory_item_id,amount, last_update_date,  last_updated_by, creation_date, created_by,  last_update_login) VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12) RETURNING *;",
    [
      incentiveTypeId,
      custAccountId,
      custgroupid,
      startDate,
      endDate,
      inventoryItemId,
      amount,
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

router.put("/update/:incentive_type_id", async (req, res, next) => {
  const incentiveTypeId = req.params.incentive_type_id;

  const schema = Joi.object({
    custAccountId: Joi.number().required(),
    custgroupid: Joi.number().allow(null),
    startDate: Joi.string().min(0),
    endDate: Joi.string().min(0),
    inventoryItemId: Joi.number().required(),
    amount: Joi.number().allow(null),
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
    custAccountId,
    custgroupid,
    startDate,
    endDate,
    inventoryItemId,
    amount,
    lastUpdateDate,
    lastUpdatedBy,
    creationDate,
    createdBy,
    lastUpdateLogin,
  } = req.body;

  const date = new Date();

  await pool.query(
    "UPDATE sales_targets_sku_all SET cust_account_id=$1,cust_group_id=$2,start_date=$3, end_date=$4,inventory_item_id=$5,amount=$6, last_update_date=$7,  last_updated_by=$8, creation_date=$9, created_by=$10,  last_update_login=$11  where incentive_type_id=$12  RETURNING *;",
    [
      custAccountId,
      custgroupid,
      startDate,
      endDate,
      inventoryItemId,
      amount,
      lastUpdateDate,
      lastUpdatedBy,
      creationDate,
      createdBy,
      lastUpdateLogin,
      incentiveTypeId,
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
