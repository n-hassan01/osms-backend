const Joi = require("joi");
const express = require("express");
const pool = require("../../dbConnection");

const router = express.Router();

router.put("/", async (req, res, next) => {
  const schema = Joi.object({
    headerId: Joi.number().required(),
    requestNumber: Joi.string().max(30).required(),
    transactionTypeId: Joi.number().allow(null),
    moveOrderType: Joi.number().allow(null),
    organizationId: Joi.number().required(),
    description: Joi.string().max(240).min(0),
    dateRequired: Joi.string().allow(null, ""),
    fromSubinventoryCode: Joi.string().max(10).min(0),
    toSubinventoryCode: Joi.string().max(10).min(0),
    headerStatus: Joi.number().allow(null),
  });
  const validation = schema.validate(req.body);

  if (validation.error) {
    console.log(validation.error);

    res.status(400).send("Invalid inputs");
  }

  const {
    headerId,
    requestNumber,
    transactionTypeId,
    moveOrderType,
    organizationId,
    description,
    dateRequired,
    fromSubinventoryCode,
    toSubinventoryCode,
    headerStatus,
  } = req.body;

  pool.query(
    "UPDATE mtl_txn_request_headers SET request_number=$1, transaction_type_id=$2, move_order_type=$3, organization_id=$4, description=$5, date_required=$6, from_subinventory_code=$7, to_subinventory_code=$8, header_status=$9 WHERE header_id = $10;",
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
      headerId,
    ],
    (error, result) => {
      try {
        if (error) throw error;
        console.log(result);

        res.status(200).send({ message: "Successfully updated!" });
      } catch (err) {
        next(err)
      }
    }
  );
});

module.exports = router;
