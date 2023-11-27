const express = require("express");
const Joi = require("joi");
const pool = require("../../dbConnection");
const router = express.Router();

router.post("/", async (req, res, next) => {
  const schema = Joi.object({
    transactionTypeId: Joi.number().allow(null),
    moveOrderType: Joi.number().allow(null),
    organizationId: Joi.number().required(),
    description: Joi.string().max(240).min(0),
    dateRequired: Joi.string().allow(null, ""),
    fromSubinventoryCode: Joi.string().max(10).min(0),
    toSubinventoryCode: Joi.string().max(10).min(0),
    // headerStatus: Joi.number().allow(null),
    statusDate: Joi.string().min(0),
    // lastUpdatedBy: Joi.number().required(),
    lastUpdateLogin: Joi.number().allow(null),
    // lastUpdateDate: Joi.string().required(),
    createdBy: Joi.number().allow(null),
    // creationDate: Joi.string().min(0),
  });

  const validation = schema.validate(req.body);

  if (validation.error) {
    console.log(validation.error);

    res.status(400).send("Invalid inputs");
  }

  const {
    // requestNumber,
    transactionTypeId,
    moveOrderType,
    organizationId,
    description,
    dateRequired,
    fromSubinventoryCode,
    toSubinventoryCode,
    statusDate,
    lastUpdatedBy,
    lastUpdateLogin,
    // lastUpdateDate,
    createdBy,
    // creationDate,
  } = req.body;

  const date = new Date();

  const result = await pool.query(
    "INSERT INTO mtl_txn_request_headers(transaction_type_id, move_order_type, organization_id, description, date_required, from_subinventory_code, to_subinventory_code, header_status, status_date, last_updated_by, last_update_login, last_update_date, created_by, creation_date) VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12, $13, $14) RETURNING header_id, request_number, created_by, header_status, organization_id;",
    [
      transactionTypeId,
      moveOrderType,
      organizationId,
      description,
      dateRequired,
      fromSubinventoryCode,
      toSubinventoryCode,
      "Incomplete",
      statusDate,
      lastUpdatedBy,
      lastUpdateLogin,
      date,
      createdBy,
      date,
    ],
    (error, result) => {
      try {
        if (error) throw error;

        res
          .status(200)
          .json({ message: "Successfully added!", headerInfo: result.rows });
      } catch (err) {
        next(err);
      }
    }
  );
});

module.exports = router;
