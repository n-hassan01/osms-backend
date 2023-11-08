const Joi = require("joi");
const express = require("express");
const pool = require("../../dbConnection");
const router = express.Router();

router.post("/", async (req, res, next) => {
  const schema = Joi.object({
    lastUpdateDate: Joi.string().min(0),
    lastUpdatedBy: Joi.number().min(0),
    creationDate: Joi.string().min(0),
    createdBy: Joi.number().min(0),
    transactionTypeName: Joi.string().max(88).required(),
    description: Joi.string().max(240),
    transactionActionId: Joi.number().min(0),
    transactionSourceTypeId: Joi.number().min(0),
  });
  const validation = schema.validate(req.body);
  if (validation.error) {
    console.log(validation.error.message);
    res.status(400).send("Invalid inputs");
  } else {
    const {
      lastUpdateDate,
      lastUpdatedBy,
      creationDate,
      createdBy,
      transactionTypeName,
      description,
      transactionActionId,
      transactionSourceTypeId,
    } = req.body;

    await pool.query(
      "INSERT INTO mtl_transaction_types (last_update_date,last_updated_by,creation_date,created_by,transaction_type_name,description,transaction_action_id,transaction_source_type_id) VALUES ($1, $2,$3,$4,$5,$6,$7,$8)",
      [
        lastUpdateDate,
        lastUpdatedBy,
        creationDate,
        createdBy,
        transactionTypeName,
        description,
        transactionActionId,
        transactionSourceTypeId,
      ],
      (error, result) => {
        try {
          if (error) throw error;

          res.status(200).json({ message: "Successfully completed adding" });
        } catch (err) {
          next(err);
        }
      }
    );
  }
});

module.exports = router;
