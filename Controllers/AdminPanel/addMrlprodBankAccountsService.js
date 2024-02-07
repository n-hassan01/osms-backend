const express = require("express");
const Joi = require("joi");
const pool = require("../../dbConnection");
const router = express.Router();

router.post("/add", async (req, res, next) => {
  const schema = Joi.object({
    bankAccountNum: Joi.string().max(30).required(),
    bankAccountName: Joi.string().max(100).required(),
    bankAccountNameAlt: Joi.string().max(320).allow(null),
    bankBranchId: Joi.number().required(),
    bankId: Joi.number().required(),
    accountHolderName: Joi.string().max(240).allow(null),
    accountClassification: Joi.string().max(30).required(),
    legalEntityId: Joi.number(),
    lastUpdateDate: Joi.string().required(),
    lastUpdatedBy: Joi.number().required(),
    lastUpdateLogin: Joi.number(),
    creationDate: Joi.string().required(),
    createdBy: Joi.number().required(),
  });

  const validation = schema.validate(req.body);

  if (validation.error) {
    console.log(validation.error.message);

    return res.status(400).send("Invalid inputs");
  }

  const {
    bankAccountNum,
    bankAccountName,
    bankAccountNameAlt,
    bankBranchId,
    bankId,
    accountHolderName,
    accountClassification,
    legalEntityId,
    lastUpdateDate,
    lastUpdatedBy,
    lastUpdateLogin,
    creationDate,
    createdBy,
  } = req.body;

  const date = new Date();

  await pool.query(
    "INSERT INTO bank_accounts (bank_account_num, bank_account_name, bank_account_name_alt, bank_branch_id, bank_id, account_holder_name, account_classification, legal_entity_id, last_update_date, last_updated_by, last_update_login, creation_date, created_by) VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12, $13) RETURNING *;",
    [
      bankAccountNum,
      bankAccountName,
      bankAccountNameAlt,
      bankBranchId,
      bankId,
      accountHolderName,
      accountClassification,
      legalEntityId,
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
  await pool.query("SELECT * FROM bank_accounts;", (error, result) => {
    try {
      if (error) throw error;
      res.status(200).send(result.rows);
    } catch (err) {
      next(err);
    }
  });
});

router.get("/get/:bank_account_id", async (req, res, next) => {
  const bankAccountId = req.params.bank_account_id;
  await pool.query(
    "SELECT * FROM bank_accounts WHERE bank_account_id=$1;",
    [bankAccountId],
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

router.put("/update/:bank_account_id", async (req, res, next) => {
  const bankAccountId = req.params.bank_account_id;

  const schema = Joi.object({
    bankAccountNum: Joi.string().max(30).required(),
    bankAccountName: Joi.string().max(100).required(),
    bankAccountNameAlt: Joi.string().max(320).allow(null),
    bankBranchId: Joi.number().required(),
    bankId: Joi.number().required(),
    accountHolderName: Joi.string().max(240).allow(null),
    accountClassification: Joi.string().max(30).required(),
    legalEntityId: Joi.number(),
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
    bankAccountNum,
    bankAccountName,
    bankAccountNameAlt,
    bankBranchId,
    bankId,
    accountHolderName,
    accountClassification,
    legalEntityId,
    lastUpdateDate,
    lastUpdatedBy,
    lastUpdateLogin,
    creationDate,
    createdBy,
  } = req.body;

  const date = new Date();

  await pool.query(
    "UPDATE bank_accounts SET bank_account_num=$1, bank_account_name=$2, bank_account_name_alt=$3, bank_branch_id=$4, bank_id=$5, account_holder_name=$6,account_classification=$7,legal_entity_id=$8, last_update_date=$9, last_updated_by=$10,  last_update_login=$11, creation_date=$12, created_by=$13 WHERE bank_account_id=$14;",
    [
      bankAccountNum,
      bankAccountName,
      bankAccountNameAlt,
      bankBranchId,
      bankId,
      accountHolderName,
      accountClassification,
      legalEntityId,
      lastUpdateDate,
      lastUpdatedBy,
      lastUpdateLogin,
      creationDate,
      createdBy,
      bankAccountId,
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

router.delete("/delete/:bank_account_id", async (req, res, next) => {
  const bankAccountId = req.params.bank_account_id;
  //const now = new Date();

  await pool.query(
    "DELETE FROM bank_accounts WHERE bank_account_id = $1",
    [bankAccountId],
    (error, result) => {
      try {
        if (error) throw error;

        res.status(200).json(`Deleted with BankAccountId: ${bankAccountId}`);
      } catch (err) {
        next(err);
      }
    }
  );
});
module.exports = router;
