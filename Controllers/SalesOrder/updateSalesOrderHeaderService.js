const express = require("express");
const Joi = require("joi");
const pool = require("../../dbConnection");
const router = express.Router();

router.put("/:header_id", async (req, res, next) => {
  const headerId = req.params.header_id;

  const schema = Joi.object({
    requestDate: Joi.string().min(0),
    paymentTermId: Joi.number().allow(null),
    shippingMethodCode: Joi.string().max(30).min(0),
    cancelledFlag: Joi.string().max(1).min(0),
    bookedFlag: Joi.string().max(1).min(1),
    salesrepId: Joi.number().allow(null),
    bookedDate: Joi.string().min(0),
  });

  const validation = schema.validate(req.body);

  if (validation.error) {
    console.log(validation.error);

    return res.status(400).send("Invalid inputs");
  }

  const {
    requestDate,
    paymentTermId,
    shippingMethodCode,
    cancelledFlag,
    bookedFlag,
    salesrepId,
    bookedDate,
  } = req.body;

  const date = new Date();

  await pool.query(
    "UPDATE oe_order_headers_all SET request_date=$1, payment_term_id=$2, shipping_method_code=$3, cancelled_flag=$4, booked_flag=$5, salesrep_id=$6, booked_date=$7 WHERE header_id=&8;",
    [
      requestDate,
      paymentTermId,
      shippingMethodCode,
      cancelledFlag,
      bookedFlag,
      salesrepId,
      bookedDate,
      headerId,
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
