const express = require("express");
const pool = require("../../dbConnection");
const router = express.Router();
const Joi = require("joi");

router.get("/", async (req, res, next) => {
  await pool.query(
    "SELECT * FROM ar_cash_rec_customer_all;",
    (error, result) => {
      try {
        if (error) throw error;

        res.status(200).json(result.rows);
      } catch (err) {
        next(err);
      }
    }
  );
});

router.post("/add", async (req, res, next) => {
  const schema = Joi.object({
    cashReceiptId: Joi.number().required(),
    payFromCustomer: Joi.number().required(),
    amount: Joi.number().allow(null),
    invoiceNumber: Joi.string().max(40).required(),
    remarks: Joi.string().max(100).min(0),
    lastUpdatedBy: Joi.number().allow(null),
    lastUpdateDate: Joi.date().allow(null, ''),
    lastUpdateLogin: Joi.number().allow(null),
    createdBy: Joi.number().allow(null),
    creationDate: Joi.date().allow(null, ''),
  });

  const validation = schema.validate(req.body);

  if (validation.error) {
    console.log(validation.error);

    return res.status(400).send("Invalid inputs");
  }

  const {
    cashReceiptId,
    payFromCustomer,
    amount,
    invoiceNumber,
    remarks,
    lastUpdatedBy,
    lastUpdateDate,
    lastUpdateLogin,
    createdBy,
    creationDate,
  } = req.body;

  try {
    await pool.query(
      `INSERT INTO public.ar_cash_rec_customer_all(
        cash_receipt_id, pay_from_customer, amount, invoice_number, remarks, last_updated_by, last_update_date, 
        last_update_login, created_by, creation_date)
        VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10);`,
      [
        cashReceiptId,
        payFromCustomer,
        amount,
        invoiceNumber,
        remarks,
        lastUpdatedBy,
        lastUpdateDate,
        lastUpdateLogin,
        createdBy,
        creationDate,
      ]
    );

    return res.status(200).json({ message: "Successfully added!" });
  } catch (error) {
    console.error(error);
    return next(error);
  }
});

module.exports = router;
