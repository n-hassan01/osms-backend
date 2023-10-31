const Joi = require("joi");
const express = require("express");
const pool = require("../../dbConnection");

const router = express.Router();

router.put("/", async (req, res, next) => {
  const schema = Joi.object({
    inventoryItemId: Joi.number().max(999999999999999).required(),
    organizationId: Joi.number().max(999999999999999).required(),
    inventoryItemCode: Joi.string().max(40).required(),
    description: Joi.string().max(240),
    primaryUomCode: Joi.string().max(3),
    primaryUnitOfMeasure: Joi.string().max(25),
    lastUpdateDate: Joi.string().required(),
    lastUpdatedBy: Joi.string().required(),
    creationDate: Joi.string().required(),
    createdBy: Joi.string().required(),
    lastUpdateLogin: Joi.number(),
    enableFlag: Joi.string().max(1).required(),
    startDateActive: Joi.string().min(0),
    endDateActive: Joi.string().min(0),
    buyerId: Joi.number().max(999999999999999),
    segment1: Joi.string().max(40),
    segment2: Joi.string().max(40),
    segment3: Joi.string().max(40),
    segment4: Joi.string().max(40),
    segment5: Joi.string().max(40),
    purchasingItemFlag: Joi.string().max(1).required(),
    serviceItemFlag: Joi.string().max(1).required(),
    inventoryItemFlag: Joi.string().max(1).required(),
    allowItemDescUpdateFlag: Joi.string().max(1),
    inspectionRequiredFlag: Joi.string().max(1),
    receiptRequiredFlag: Joi.string().max(1),
    rfqRequiredFlag: Joi.string().max(1),
    qtyRcvTolerance: Joi.number(),
    unitOfIssue: Joi.string().max(25),
    daysEarlyReceiptAllowed: Joi.number(),
    daysLateReceiptAllowed: Joi.number(),
    receivingRoutingId: Joi.number(),
    shelfLifeCode: Joi.number(),
    shelfLifeDays: Joi.number(),
    sourceOrganizationId: Joi.number(),
    sourceSubInventory: Joi.string().max(10),
    acceptableEarlyDays: Joi.number(),
    fixedLeadTime: Joi.number(),
    variableLeadTime: Joi.number(),
    minMinmaxQuantity: Joi.number(),
    maxMinmaxQuantity: Joi.number(),
    minimumOrderQuantity: Joi.number(),
    maximumOrderQuantity: Joi.number(),
    paymentTermsId: Joi.number(),
  });
  const validation = schema.validate(req.body);

  if (validation.error) {
    console.log(validation.error);

    res.status(400).send("Invalid inputs");
  }

  const {
    inventoryItemId,
    organizationId,
    inventoryItemCode,
    description,
    primaryUomCode,
    primaryUnitOfMeasure,
    lastUpdateDate,
    lastUpdatedBy,
    creationDate,
    createdBy,
    lastUpdateLogin,
    enableFlag,
    startDateActive,
    endDateActive,
    buyerId,
    segment1,
    segment2,
    segment3,
    segment4,
    segment5,
    purchasingItemFlag,
    serviceItemFlag,
    inventoryItemFlag,
    allowItemDescUpdateFlag,
    inspectionRequiredFlag,
    receiptRequiredFlag,
    rfqRequiredFlag,
    qtyRcvTolerance,
    unitOfIssue,
    daysEarlyReceiptAllowed,
    daysLateReceiptAllowed,
    receivingRoutingId,
    shelfLifeCode,
    shelfLifeDays,
    sourceOrganizationId,
    sourceSubInventory,
    acceptableEarlyDays,
    fixedLeadTime,
    variableLeadTime,
    minMinmaxQuantity,
    maxMinmaxQuantity,
    minimumOrderQuantity,
    maximumOrderQuantity,
    paymentTermsId,
  } = req.body;

  try {
    await pool.query(
      "UPDATE mtl_system_items SET inventory_item_id=$1, organization_id=$2, inventory_item_code=$3, description=$4, primary_uom_code=$5, primary_unit_of_measure=$6, last_update_date=$7, last_updated_by=$8, creation_date=$9, created_by=$10, last_update_login=$11, enabled_flag=$12, start_date_active=$13, end_date_active=$14, buyer_id=$15, segment1=$16, segment2=$17, segment3=$18, segment4=$19, segment5=$20, purchasing_item_flag=$21, service_item_flag=$22, inventory_item_flag=$23, allow_item_desc_update_flag=$24, inspection_required_flag=$25, receipt_required_flag=$26, rfq_required_flag=$27, qty_rcv_tolerance=$28, unit_of_issue=$29, days_early_receipt_allowed=$30, days_late_receipt_allowed=$31, receiving_routing_id=$32, shelf_life_code=$33, shelf_life_days=$34, source_organization_id=$35, source_subinventory=$36, acceptable_early_days=$37, fixed_lead_time=$38, variable_lead_time=$39, min_minmax_quantity=$40, max_minmax_quantity=$41, minimum_order_quantity=$42, maximum_order_quantity=$43, payment_terms_id=$44 WHERE inventory_item_id=$45 AND organization_id=$46;",
      [
        inventoryItemId,
        organizationId,
        inventoryItemCode,
        description,
        primaryUomCode,
        primaryUnitOfMeasure,
        lastUpdateDate,
        lastUpdatedBy,
        creationDate,
        createdBy,
        lastUpdateLogin,
        enableFlag,
        startDateActive,
        endDateActive,
        buyerId,
        segment1,
        segment2,
        segment3,
        segment4,
        segment5,
        purchasingItemFlag,
        serviceItemFlag,
        inventoryItemFlag,
        allowItemDescUpdateFlag,
        inspectionRequiredFlag,
        receiptRequiredFlag,
        rfqRequiredFlag,
        qtyRcvTolerance,
        unitOfIssue,
        daysEarlyReceiptAllowed,
        daysLateReceiptAllowed,
        receivingRoutingId,
        shelfLifeCode,
        shelfLifeDays,
        sourceOrganizationId,
        sourceSubInventory,
        acceptableEarlyDays,
        fixedLeadTime,
        variableLeadTime,
        minMinmaxQuantity,
        maxMinmaxQuantity,
        minimumOrderQuantity,
        maximumOrderQuantity,
        paymentTermsId,
      ],
      (error) => {
        if (error) throw error;

        res.status(200).send({ message: "Successfully updated!" });
      }
    );
  } catch (error) {
    next(error);
  }
});

module.exports = router;
