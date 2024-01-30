const express = require("express");
const Joi = require("joi");
const pool = require("../../dbConnection");
const router = express.Router();

router.post("/add", async (req, res, next) => {
  const schema = Joi.object({
    bankId: Joi.number().required(),
    bankCode: Joi.string().max(30),
    bankBranchName: Joi.string().max(60).required(),
    bankBranchNameAlt: Joi.string().max(320).allow(null),
    description: Joi.string().max(240).allow(null),
    addressLine1: Joi.string().max(35).allow(null),
    city: Joi.string().max(25).allow(null),
    lastUpdateDate: Joi.string().required(),
    lastUpdatedBy: Joi.number().required(),
    lastUpdateLogin: Joi.number(),
    creationDate: Joi.string(),
    createdBy: Joi.number(),
    activeDate: Joi.string(),
    bankAdminEmail: Joi.string().max(255),
  });

  const validation = schema.validate(req.body);

  if (validation.error) {
    console.log(validation.error.message);

    return res.status(400).send("Invalid inputs");
  }

  const {
    bankId,
    bankCode,
    bankBranchName,
    bankBranchNameAlt,
    description,
    addressLine1,
    city,
    lastUpdateDate,
    lastUpdatedBy,
    lastUpdateLogin,
    creationDate,
    createdBy,
    activeDate,
    bankAdminEmail,
  } = req.body;

  const date = new Date();

  await pool.query(
    "INSERT INTO mrlprod_bank_branches (bank_id,bank_code, bank_branch_name, bank_branch_name_alt, description, address_line1, city, last_update_date, last_updated_by,  last_update_login, creation_date, created_by,active_date,bank_admin_email) VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12, $13, $14) RETURNING *;",
    [
      bankId,
      bankCode,
      bankBranchName,
      bankBranchNameAlt,
      description,
      addressLine1,
      city,
      lastUpdateDate,
      lastUpdatedBy,
      lastUpdateLogin,
      creationDate,
      createdBy,
      activeDate,
      bankAdminEmail,
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
  await pool.query(
    "SELECT * FROM public.mrlprod_bank_branches;",
    (error, result) => {
      try {
        if (error) throw error;
        res.status(200).send(result.rows);
      } catch (err) {
        next(err);
      }
    }
  );
});

router.get("/get/:bank_branch_id", async (req, res, next) => {
  const bankBranchId = req.params.bank_branch_id;
  await pool.query(
    "SELECT * FROM public.mrlprod_bank_branches WHERE bank_branch_id=$1;",
    [bankBranchId],
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

router.put("/update/:bank_branch_id", async (req, res, next) => {
  const bankBranchId = req.params.bank_branch_id;

  const schema = Joi.object({
    bankId: Joi.number().required(),
    bankCode: Joi.string().max(30),
    bankBranchName: Joi.string().max(60).required(),
    bankBranchNameAlt: Joi.string().max(320).allow(null),
    description: Joi.string().max(240).allow(null),
    addressLine1: Joi.string().max(35).allow(null),
    city: Joi.string().max(25).allow(null),
    lastUpdateDate: Joi.string().required(),
    lastUpdatedBy: Joi.number().required(),
    lastUpdateLogin: Joi.number(),
    creationDate: Joi.string(),
    createdBy: Joi.number(),
    activeDate: Joi.string(),
    bankAdminEmail: Joi.string().max(255),
  });

  const validation = schema.validate(req.body);
  if (validation.error) {
    console.log(validation.error.message);

    return res.status(400).send("Invalid inputs");
  }

  const {
    bankId,
    bankCode,
    bankBranchName,
    bankBranchNameAlt,
    description,
    addressLine1,
    city,
    lastUpdateDate,
    lastUpdatedBy,
    lastUpdateLogin,
    creationDate,
    createdBy,
    activeDate,
    bankAdminEmail,
  } = req.body;
  const date = new Date();

  await pool.query(
    "UPDATE mrlprod_bank_branches SET bank_id=$1, bank_code=$2, bank_branch_name=$3, bank_branch_name_alt=$4, description=$5, address_line1=$6, city=$7, last_update_date=$8, last_updated_by=$9,  last_update_login=$10, creation_date=$11, created_by=$12, active_date=$13,bank_admin_email=$14 WHERE bank_branch_id=$15;",
    [
      bankId,
      bankCode,
      bankBranchName,
      bankBranchNameAlt,
      description,
      addressLine1,
      city,
      lastUpdateDate,
      lastUpdatedBy,
      lastUpdateLogin,
      creationDate,
      createdBy,
      activeDate,
      bankAdminEmail,
      bankBranchId,
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

router.delete("/delete/:bank_branch_id", async (req, res, next) => {
  const bankBranchId = req.params.bank_branch_id;
  //const now = new Date();

  await pool.query(
    "DELETE FROM mrlprod_bank_branches WHERE bank_branch_id = $1",
    [bankBranchId],
    (error, result) => {
      try {
        if (error) throw error;

        res.status(200).json(`Deleted with BankBranchId: ${bankBranchId}`);
      } catch (err) {
        next(err);
      }
    }
  );
});
module.exports = router;
