const express = require("express");
const Joi = require("joi");
const pool = require("../../dbConnection");
const router = express.Router();

// get api for all sales target
router.get("/getAll", async (req, res, next) => {
  await pool.query("SELECT * FROM sales_details_all;", (error, result) => {
    try {
      if (error) throw error;

      res.status(200).json(result.rows);
    } catch (err) {
      next(err);
    }
  });
});

// add sales target api
router.post("/add", async (req, res, next) => {
  const schema = Joi.object({
    orderDate: Joi.string().min(0),
    orderNumber: Joi.number().allow(null),
    custAccountId: Joi.number().required(),
    custgroupid: Joi.number().allow(null),
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
    orderDate,
    orderNumber,
    custAccountId,
    custgroupid,
    amount,
    lastUpdateDate,
    lastUpdatedBy,
    creationDate,
    createdBy,
    lastUpdateLogin,
  } = req.body;

  const date = new Date();

  await pool.query(
    "INSERT INTO sales_details_all(order_date,order_number,cust_account_id,cust_group_id,amount, last_update_date,  last_updated_by, creation_date, created_by, last_update_login) VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10) RETURNING *;",
    [
      orderDate,
      orderNumber,
      custAccountId,
      custgroupid,
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

router.put("/update/:order_number", async (req, res, next) => {
  const orderNumber = req.params.order_number;

  const schema = Joi.object({
    orderDate: Joi.string().min(0),
    custAccountId: Joi.number().required(),
    custgroupid: Joi.number().allow(null),
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
    orderDate,
    custAccountId,
    custgroupid,
    amount,
    lastUpdateDate,
    lastUpdatedBy,
    creationDate,
    createdBy,
    lastUpdateLogin,
  } = req.body;

  const date = new Date();

  await pool.query(
    "UPDATE sales_details_all SET orderDate=$1, cust_account_id=$2,cust_group_id=$3,amount=$4, last_update_date=$5,  last_updated_by=$6, creation_date=$7, created_by=$8,  last_update_login=$9  where order_number=$10  RETURNING *;",
    [
      orderDate,
      custAccountId,
      custgroupid,
      amount,
      lastUpdateDate,
      lastUpdatedBy,
      creationDate,
      createdBy,
      lastUpdateLogin,
      orderNumber,
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
