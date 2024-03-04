const express = require("express");
const Joi = require("joi");
const pool = require("../../dbConnection");
const router = express.Router();

router.post("/", async (req, res, next) => {
  const schema = Joi.object({
    requestDate: Joi.string().min(0),
    paymentTermId: Joi.number().allow(null),
    orderNumber: Joi.number().required(),
    createdBy: Joi.number().required(),
    // orderTypeId: Joi.number().required(),
    lastUpdatedBy: Joi.number().required(),
    shippingMethodCode: Joi.string().max(30).min(0),
    // cancelledFlag: Joi.string().max(1).min(0),
    // bookedFlag: Joi.string().max(1).min(1),
    salesrepId: Joi.number().allow(null),
    salesChannelCode: Joi.string().min(0).max(30),
    bookedDate: Joi.string().min(0),
    bookedDate: Joi.string().min(0),
    description: Joi.string().min(0),
    shipTo: Joi.string().min(0),
    specialDiscount: Joi.number().allow(null),
    specialAdjustment: Joi.number().allow(null),
    distributor: Joi.string().min(0),
    soldToOrgId: Joi.number().allow(null),
    shipToOrgId: Joi.number().allow(null),
    invoiceToOrgId: Joi.number().allow(null),
    deliverToOrgId: Joi.number().allow(null),
    soldToContactId: Joi.number().allow(null),
    shipToContactId: Joi.number().allow(null),
    invoiceToContactId: Joi.number().allow(null),
    deliverToContactId: Joi.number().allow(null),
  });

  const validation = schema.validate(req.body);

  if (validation.error) {
    console.log(validation.error.message);

    return res.status(400).send("Invalid inputs");
  }

  const {
    requestDate,
    paymentTermId,
    shippingMethodCode,
    // cancelledFlag,
    // bookedFlag,
    salesrepId,
    salesChannelCode,
    bookedDate,
    createdBy,
    lastUpdatedBy,
    description,
    orderNumber,
    shipTo,
    specialDiscount,
    specialAdjustment,
    distributor,
    soldToOrgId,
    shipToOrgId,
    invoiceToOrgId,
    deliverToOrgId,
    soldToContactId,
    shipToContactId,
    invoiceToContactId,
    deliverToContactId,
  } = req.body;

  const date = new Date();

  await pool.query(
    "INSERT INTO oe_order_headers_all(order_number, last_update_date, last_updated_by, created_by, creation_date, order_type_id, ordered_date, request_date, payment_term_id, shipping_method_code, cancelled_flag, open_flag, booked_flag, salesrep_id, sales_channel_code, booked_date, description,ship_to,special_discount,special_adjustment, distributor, sold_to_org_id, ship_to_org_id, invoice_to_org_id, deliver_to_org_id, sold_to_contact_id, ship_to_contact_id, invoice_to_contact_id, deliver_to_contact_id) VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12,$13, $14, $15, $16, $17, $18, $19, $20, $21, $22, $23, $24, $25, $26, $27, $28, $29) RETURNING order_number, header_id, authorization_status;",
    [
      orderNumber,
      date,
      lastUpdatedBy,
      createdBy,
      date,
      1,
      date,
      requestDate,
      paymentTermId,
      shippingMethodCode,
      "N",
      "Y",
      "N",
      salesrepId,
      salesChannelCode,
      bookedDate,
      description,
      shipTo,
      specialDiscount,
      specialAdjustment,
      distributor,
      soldToOrgId,
      shipToOrgId,
      invoiceToOrgId,
      deliverToOrgId,
      soldToContactId,
      shipToContactId,
      invoiceToContactId,
      deliverToContactId,
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
