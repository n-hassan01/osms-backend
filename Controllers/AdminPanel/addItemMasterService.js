const express = require("express");
const Joi = require("joi");
const pool = require("../../dbConnection");
const router = express.Router();

router.post("/", async (req, res, next) => {
  try {
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

    await pool.query(
      "SELECT COUNT(*) FROM mtl_system_items WHERE inventory_item_id = $1",
      [inventoryItemId],
      (error, result) => {
        if (error) throw error;

        const countExistUserId = result.rows[0].count;
        if (countExistUserId === "0") {
          pool.query(
            "INSERT INTO mtl_system_items(inventory_item_id, organization_id, inventory_item_code, description, primary_uom_code, primary_unit_of_measure, last_update_date, last_updated_by, creation_date, created_by, last_update_login, enabled_flag, start_date_active, end_date_active, buyer_id, segment1, segment2, segment3, segment4, segment5, purchasing_item_flag, service_item_flag, inventory_item_flag, allow_item_desc_update_flag, inspection_required_flag, receipt_required_flag, rfq_required_flag, qty_rcv_tolerance, unit_of_issue, days_early_receipt_allowed, days_late_receipt_allowed, receiving_routing_id, shelf_life_code, shelf_life_days, source_organization_id, source_subinventory, acceptable_early_days, fixed_lead_time, variable_lead_time, min_minmax_quantity, max_minmax_quantity, minimum_order_quantity, maximum_order_quantity, payment_terms_id) VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12, $13, $14, $15, $16, $17, $18, $19, $20, $21, $22, $23, $24, $25, $26, $27, $28, $29, $30, $31, $32, $33, $34, $35, $36, $37, $38, $39, $40, $41, $42, $43, $44);",
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
              "y",
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
            (error, result) => {
              if (error) throw error;

              res.status(200).json({ message: "Successfully added!" });
            }
          );
        } else {
          res.status(400).json({ message: "Bad request!" });
        }
      }
    );
  } catch (err) {
    next(err);
  }
});

module.exports = router;
