const express = require("express");
const Joi = require("joi");
const pool = require("../../dbConnection");
const router = express.Router();

router.post("/", async (req, res, next) => {
  const schema = Joi.object({
    orderedDate: Joi.string().required(),
    requestDate: Joi.string().min(0),
    paymentTermId: Joi.number().allow(null),
    createdBy: Joi.number().required(),
    // orderTypeId: Joi.number().required(),
    lastUpdatedBy: Joi.number().required(),
    shippingMethodCode: Joi.string().max(30).min(0),
    cancelledFlag: Joi.string().max(1).min(0),
    bookedFlag: Joi.string().max(1).min(1),
    salesrepId: Joi.number().allow(null),
    salesChannelCode: Joi.string().min(0).max(30),
    bookedDate: Joi.string().min(0),
  });

  const validation = schema.validate(req.body);

  if (validation.error) {
    console.log(validation.error);

    return res.status(400).send("Invalid inputs");
  }

  const {
    orderedDate,
    requestDate,
    paymentTermId,
    shippingMethodCode,
    cancelledFlag,
    bookedFlag,
    salesrepId,
    salesChannelCode,
    bookedDate,
    createdBy,
    lastUpdatedBy,
    // orderTypeId,
  } = req.body;

  const date = new Date();

  await pool.query(
    "INSERT INTO oe_order_headers_all(last_update_date, last_updated_by, created_by, creation_date, order_type_id, ordered_date, request_date, payment_term_id, shipping_method_code, cancelled_flag, open_flag, booked_flag, salesrep_id, sales_channel_code, booked_date) VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12,$13, $14, $15) RETURNING order_number, header_id;",
    [
      date,
      lastUpdatedBy,
      createdBy,
      date,
      1,
      orderedDate,
      requestDate,
      paymentTermId,
      shippingMethodCode,
      cancelledFlag,
      "Y",
      bookedFlag,
      salesrepId,
      salesChannelCode,
      bookedDate,
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

module.exports = router;
