const express = require("express");
const Joi = require("joi");
const pool = require("../../dbConnection");
const router = express.Router();

router.post("/", async (req, res, next) => {
  const schema = Joi.object({
    requestNumber: Joi.string().max(30).required(),
    transactionTypeId: Joi.number().allow(null),
    moveOrderType: Joi.number().allow(null),
    organizationId: Joi.number().required(),
    description: Joi.string().max(240).min(0),
    dateRequired: Joi.string().allow(null, ''),
    fromSubinventoryCode: Joi.string().max(10).min(0),
    toSubinventoryCode: Joi.string().max(10).min(0),
    headerStatus: Joi.number().allow(null),
    statusDate: Joi.string().min(0),
    lastUpdatedBy: Joi.number().required(),
    lastUpdateLogin: Joi.number().allow(null),
    lastUpdateDate: Joi.string().required(),
    createdBy: Joi.number().allow(null),
    creationDate: Joi.string().min(0),
  });

  const validation = schema.validate(req.body);

  if (validation.error) {
    console.log(validation.error);

    res.status(400).send("Invalid inputs");
  }

  const {
    requestNumber,
    transactionTypeId,
    moveOrderType,
    organizationId,
    description,
    dateRequired,
    fromSubinventoryCode,
    toSubinventoryCode,
    headerStatus,
    statusDate,
    lastUpdatedBy,
    lastUpdateLogin,
    lastUpdateDate,
    createdBy,
    creationDate,
  } = req.body;

  pool.query(
    "INSERT INTO mtl_txn_request_headers(request_number, transaction_type_id, move_order_type, organization_id, description, date_required, from_subinventory_code, to_subinventory_code, header_status, status_date, last_updated_by, last_update_login, last_update_date, created_by, creation_date) VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12, $13, $14, $15);",
    [
      requestNumber,
      transactionTypeId,
      moveOrderType,
      organizationId,
      description,
      dateRequired,
      fromSubinventoryCode,
      toSubinventoryCode,
      headerStatus,
      statusDate,
      lastUpdatedBy,
      lastUpdateLogin,
      lastUpdateDate,
      createdBy,
      creationDate,
    ],
    (error, result) => {
      try {
        if (error) throw error;

        res.status(200).json({ message: "Successfully added!" });
      } catch (err) {
        next(err);
      }
    }
  );
});

module.exports = router;
