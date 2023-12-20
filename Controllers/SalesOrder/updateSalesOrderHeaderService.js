const express = require("express");
const Joi = require("joi");
const pool = require("../../dbConnection");
const router = express.Router();

router.put("/:header_id", async (req, res, next) => {
  const headerId = req.params.header_id;

  const schema = Joi.object({
    // requestDate: Joi.string().min(0),
    // paymentTermId: Joi.number().allow(null),
    lastUpdatedBy: Joi.number().allow(null),
    shippingMethodCode: Joi.string().max(30).min(0),
    // cancelledFlag: Joi.string().max(1).min(0),
    // bookedFlag: Joi.string().max(1).min(1),
    // salesrepId: Joi.number().allow(null),
    description: Joi.string().min(0),
    shipTo: Joi.string().min(0),
    specialDiscount: Joi.number().allow(null),
    specialAdjustment: Joi.number().allow(null),
    totalPrice: Joi.number().allow(null),
  });

  const validation = schema.validate(req.body);

  if (validation.error) {
    console.log(validation.error);

    return res.status(400).send("Invalid inputs");
  }

  const {
    shippingMethodCode,
    description,
    lastUpdatedBy,
    shipTo,
    specialDiscount,
    specialAdjustment,
    totalPrice,
  } = req.body;

  const date = new Date();

  await pool.query(
    "UPDATE oe_order_headers_all SET shipping_method_code=$1, description=$2, last_updated_by=$3, ship_to=$4, special_discount=$5, special_adjustment=$6, total_price=%7 WHERE header_id=$8;",
    [
      shippingMethodCode,
      description,
      lastUpdatedBy,
      shipTo,
      specialDiscount,
      specialAdjustment,
      totalPrice,
      headerId,
    ],
    (error, result) => {
      try {
        if (error) throw error;

        return res
          .status(200)
          .json({ message: "Successfully updated!", headerInfo: result.rows });
      } catch (err) {
        next(err);
      }
    }
  );
});

module.exports = router;
