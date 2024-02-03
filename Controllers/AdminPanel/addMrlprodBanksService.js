const express = require("express");
const Joi = require("joi");
const pool = require("../../dbConnection");
const router = express.Router();

router.post("/add", async (req, res, next) => {
  const schema = Joi.object({
    bankCode: Joi.string().max(30),
    bankName: Joi.string().max(60).required(),
    bankNameAlt: Joi.string().max(320).allow(null),
    description: Joi.string().max(240).allow(null),
    addressLine1: Joi.string().max(35).allow(null),
    city: Joi.string().max(25).allow(null),
    lastUpdateDate: Joi.string().required(),
    lastUpdatedBy: Joi.number().required(),
    lastUpdateLogin: Joi.number(),
    creationDate: Joi.string(),
    createdBy: Joi.number(),
  });

  const validation = schema.validate(req.body);

  if (validation.error) {
    console.log(validation.error.message);

    return res.status(400).send("Invalid inputs");
  }

  const {
    bankCode,
    bankName,
    bankNameAlt,
    description,
    addressLine1,
    city,
    lastUpdateDate,
    lastUpdatedBy,
    lastUpdateLogin,
    creationDate,
    createdBy,
  } = req.body;

  const date = new Date();

  await pool.query(
    "INSERT INTO banks (bank_code, bank_name, bank_name_alt, description, address_line1, city, last_update_date, last_updated_by,  last_update_login, creation_date, created_by) VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11) RETURNING *;",
    [
      bankCode,
      bankName,
      bankNameAlt,
      description,
      addressLine1,
      city,
      lastUpdateDate,
      lastUpdatedBy,
      lastUpdateLogin,
      creationDate,
      createdBy,
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

router.get("/get", async (req, res, next) => {
  await pool.query("SELECT * FROM banks;", (error, result) => {
    try {
      if (error) throw error;
      res.status(200).send(result.rows);
    } catch (err) {
      next(err);
    }
  });
});

router.get("/get/:bank_id", async (req, res, next) => {
  const bankId = req.params.bank_id;
  await pool.query(
    "SELECT * FROM banks WHERE bank_id=$1;",
    [bankId],
    (error, result) => {
      try {
        if (error) throw error;
        res.status(200).send(result.rows[0]);
      } catch (err) {
        next(err);
      }
    }
  );
});

router.put("/update/:bank_id", async (req, res, next) => {
  const bankId = req.params.bank_id;

  const schema = Joi.object({
    bankCode: Joi.string().max(30),
    bankName: Joi.string().max(60).required(),
    bankNameAlt: Joi.string().max(320).allow(null),
    description: Joi.string().max(240).allow(null),
    addressLine1: Joi.string().max(35).allow(null),
    city: Joi.string().max(25).allow(null),
    lastUpdateDate: Joi.string().required(),
    lastUpdatedBy: Joi.number().required(),
    lastUpdateLogin: Joi.number(),
    creationDate: Joi.string(),
    createdBy: Joi.number(),
  });

  const validation = schema.validate(req.body);
  if (validation.error) {
    console.log(validation.error.message);

    return res.status(400).send("Invalid inputs");
  }

  const {
    bankCode,
    bankName,
    bankNameAlt,
    description,
    addressLine1,
    city,
    lastUpdateDate,
    lastUpdatedBy,
    lastUpdateLogin,
    creationDate,
    createdBy,
  } = req.body;

  const date = new Date();

  await pool.query(
    "UPDATE banks SET bank_code=$1, bank_name=$2, bank_name_alt=$3, description=$4, address_line1=$5, city=$6, last_update_date=$7, last_updated_by=$8,  last_update_login=$9, creation_date=$10, created_by=$11 WHERE bank_id=$12;",
    [
      bankCode,
      bankName,
      bankNameAlt,
      description,
      addressLine1,
      city,
      lastUpdateDate,
      lastUpdatedBy,
      lastUpdateLogin,
      creationDate,
      createdBy,
      bankId,
    ],
    (error, result) => {
      try {
        if (error) throw error;

        return res.status(200).json({
          message: "Successfully updated!",
          headerInfo: result.rows[0],
        });
      } catch (err) {
        next(err);
      }
    }
  );
});

router.delete("/delete/:bank_id", async (req, res, next) => {
  const bankId = req.params.bank_id;
  //const now = new Date();

  await pool.query(
    "DELETE FROM banks WHERE bank_id = $1",
    [bankId],
    (error, result) => {
      try {
        if (error) throw error;

        res.status(200).json(`Deleted with BankId: ${bankId}`);
      } catch (err) {
        next(err);
      }
    }
  );
});
module.exports = router;
