const Joi = require("joi");
const express = require("express");
const pool = require("../../dbConnection");

const router = express.Router();

router.put("/", async (req, res, next) => {
  const schema = Joi.object({
    inventoryItemId: Joi.number().max(999999999999999).required(),
    organizationId: Joi.number().max(999999999999999).required(),
    inventoryItemCode: Joi.string().max(40).required(),
    description: Joi.string().max(240).min(0),
    primaryUomCode: Joi.string().max(3).min(0),
    primaryUnitOfMeasure: Joi.string().max(25).min(0),
    lastUpdateDate: Joi.string().required(),
    lastUpdatedBy: Joi.string().required(),
    lastUpdateLogin: Joi.number().allow(null),
    startDateActive: Joi.string().min(0),
    endDateActive: Joi.string().min(0),
    buyerId: Joi.number().max(999999999).allow(null),
    minMinmaxQuantity: Joi.number().allow(null),
    maxMinmaxQuantity: Joi.number().allow(null),
    minimumOrderQuantity: Joi.number().allow(null),
    maximumOrderQuantity: Joi.number().allow(null),
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
    startDateActive,
    endDateActive,
    buyerId,
    minMinmaxQuantity,
    maxMinmaxQuantity,
    minimumOrderQuantity,
    maximumOrderQuantity,
  } = req.body;

  await pool.query(
    "UPDATE mtl_system_items SET inventory_item_code=$1, description=$2, primary_uom_code=$3, primary_unit_of_measure=$4, last_update_date=$5, last_updated_by=$6, start_date_active=$7, end_date_active=$8, buyer_id=$9, min_minmax_quantity=$10, max_minmax_quantity=$11, minimum_order_quantity=$12, maximum_order_quantity=$13 WHERE inventory_item_id=$14 AND organization_id=$15;",
    [
      inventoryItemCode,
      description,
      primaryUomCode,
      primaryUnitOfMeasure,
      lastUpdateDate,
      lastUpdatedBy,
      startDateActive,
      endDateActive,
      buyerId,
      minMinmaxQuantity,
      maxMinmaxQuantity,
      minimumOrderQuantity,
      maximumOrderQuantity,
      inventoryItemId,
      organizationId,
    ],
    (error) => {
      try {
        if (error) throw error;

        res.status(200).send({ message: "Successfully updated!" });
      } catch (err) {
        next(error);
      }
    }
  );
});

module.exports = router;
