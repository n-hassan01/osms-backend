const express = require("express");
const Joi = require("joi");
const pool = require("../../dbConnection");
const router = express.Router();

router.post("/", async (req, res, next) => {
  const schema = Joi.object({
    headerId: Joi.number().required(),
    lineId: Joi.number().allow(null),
    lineNumber: Joi.number().required(),
    inventoryItemId: Joi.number().required(),
    organizationId: Joi.number().required(),
    revision: Joi.string().max(3).min(0),
    fromSubinventoryCode: Joi.string().max(10).min(0),
    fromLocatorId: Joi.number().allow(null),
    toSubinventoryCode: Joi.string().max(10).min(0),
    toLocatorId: Joi.number().allow(null),
    toAccountId: Joi.number().allow(null),
    lotNumber: Joi.string().max(80).min(0),
    serialNumberStart: Joi.string().max(30).min(0),
    serialNumberEnd: Joi.string().max(30).min(0),
    uomCode: Joi.string().max(3).required(),
    quantity: Joi.number().allow(null),
    quantityDelivered: Joi.number().allow(null),
    quantityDetailed: Joi.number().allow(null),
    dateRequired: Joi.string().required(),
    reasonId: Joi.number().allow(null),
    reference: Joi.string().min(0).max(240),
    referenceTypeCode: Joi.number().allow(null),
    referenceId: Joi.number().allow(null),
    transactionHeaderId: Joi.number().allow(null),
    // lineStatus: Joi.number().required(),
    // statusDate: Joi.string().required(),
    // lastUpdatedBy: Joi.number().required(),
    lastUpdateLogin: Joi.number().allow(null),
    // lastUpdateDate: Joi.string().required(),
    createdBy: Joi.number().allow(null),
    // creationDate: Joi.string().required(),
    transactionTypeId: Joi.number().allow(null),
    transactionSourceTypeId: Joi.number().allow(null),
    primaryQuantity: Joi.number().allow(null),
    toOrganizationId: Joi.number().allow(null),
    unitNumber: Joi.string().min(0).max(30),
    fromSubinventoryId: Joi.number().allow(null),
    toSubinventoryId: Joi.number().allow(null),
    inspectionStatus: Joi.number().allow(null),
    requiredQuantity: Joi.number().allow(null),
    secondaryQuantity: Joi.number().allow(null),
    secondaryQuantityDelivered: Joi.number().allow(null),
    secondaryQuantityDetailed: Joi.number().allow(null),
    secondaryRequiredQuantity: Joi.number().allow(null),
    secondaryUomCode: Joi.string().min(0).max(3),
  });

  const validation = schema.validate(req.body);

  if (validation.error) {
    console.log(validation.error);

    return res.status(400).send("Invalid inputs");
  }

  const {
    headerId,
    lineId,
    lineNumber,
    inventoryItemId,
    organizationId,
    revision,
    fromSubinventoryCode,
    fromLocatorId,
    toSubinventoryCode,
    toLocatorId,
    toAccountId,
    lotNumber,
    serialNumberStart,
    serialNumberEnd,
    uomCode,
    quantity,
    quantityDelivered,
    quantityDetailed,
    dateRequired,
    reasonId,
    reference,
    referenceTypeCode,
    referenceId,
    transactionHeaderId,
    // LineStatus,
    statusDate,
    lastUpdatedBy,
    lastUpdateLogin,
    lastUpdateDate,
    createdBy,
    // CreationDate,
    transactionTypeId,
    transactionSourceTypeId,
    primaryQuantity,
    toOrganizationId,
    unitNumber,
    fromSubinventoryId,
    toSubinventoryId,
    inspectionStatus,
    requiredQuantity,
    secondaryQuantity,
    secondaryQuantityDelivered,
    secondaryQuantityDetailed,
    secondaryRequiredQuantity,
    secondaryUomCode,
  } = req.body;

  if (!lineId) {
    const currentDate = new Date().toJSON();

    pool.query(
      "INSERT INTO public.mtl_txn_request_lines(header_id, line_number, organization_id, inventory_item_id, revision, from_subinventory_code, from_locator_id, to_subinventory_code, to_locator_id, to_account_id, lot_number, serial_number_start, serial_number_end, uom_code, quantity, quantity_delivered, quantity_detailed, date_required, reason_id, reference, reference_type_code, reference_id, transaction_header_id, line_status, status_date, last_updated_by, last_update_login, last_update_date, created_by, creation_date, transaction_type_id, transaction_source_type_id, primary_quantity, to_organization_id, unit_number, from_subinventory_id, to_subinventory_id, inspection_status, required_quantity, secondary_quantity, secondary_quantity_delivered, secondary_quantity_detailed, secondary_required_quantity, secondary_uom_code) VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12, $13, $14, $15, $16, $17, $18, $19, $20, $21, $22, $23, $24, $25, $26, $27, $28, $29, $30, $31, $32, $33, $34, $35, $36, $37, $38, $39, $40, $41, $42, $43, $44) RETURNING line_id;",
      [
        headerId,
        lineNumber,
        organizationId,
        inventoryItemId,
        revision,
        fromSubinventoryCode,
        fromLocatorId,
        toSubinventoryCode,
        toLocatorId,
        toAccountId,
        lotNumber,
        serialNumberStart,
        serialNumberEnd,
        uomCode,
        quantity,
        quantityDelivered,
        quantityDetailed,
        dateRequired,
        reasonId,
        reference,
        referenceTypeCode,
        referenceId,
        transactionHeaderId,
        "Incomplete",
        statusDate,
        lastUpdatedBy,
        lastUpdateLogin,
        lastUpdateDate,
        createdBy,
        currentDate,
        transactionTypeId,
        transactionSourceTypeId,
        primaryQuantity,
        toOrganizationId,
        unitNumber,
        fromSubinventoryId,
        toSubinventoryId,
        inspectionStatus,
        requiredQuantity,
        secondaryQuantity,
        secondaryQuantityDelivered,
        secondaryQuantityDetailed,
        secondaryRequiredQuantity,
        secondaryUomCode,
      ],
      (error, result) => {
        try {
          if (error) throw error;

          return res.status(200).json({ message: "Successfully added!", lineInfo: result.rows[0] });
        } catch (err) {
          next(err);
        }
      }
    );
  }
});

module.exports = router;
