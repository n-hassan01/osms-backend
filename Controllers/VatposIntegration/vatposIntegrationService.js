const express = require("express");
const Joi = require("joi");
const pool = require("../../dbConnection");
const router = express.Router();

router.post("/sales/add", async (req, res, next) => {
  const schema = Joi.object({
    SaleId: Joi.number().required(),
    CompanyCode: Joi.number().allow(null),
    CompanyName: Joi.string().min(0),
    InvoiceNo: Joi.string().min(0),
    PartyId: Joi.number().allow(null),
    PartyName: Joi.string().min(0),
    ServedBy: Joi.string().min(0),
    Phone: Joi.string().min(0),
    PaymentMode: Joi.string().min(0),
    HarlanCash: Joi.number().allow(null),
    MaterialIds: Joi.array().items(Joi.number()).required(),
  });

  const validation = schema.validate(req.body);

  if (validation.error) {
    console.log(validation.error.message);
    return res.status(400).send("Invalid inputs");
  }

  const {
    SaleId,
    CompanyCode,
    CompanyName,
    InvoiceNo,
    PartyId,
    PartyName,
    ServedBy,
    Phone,
    PaymentMode,
    HarlanCash,
    MaterialIds,
  } = req.body;

  try {
    for (const materialId of MaterialIds) {
      const result = await pool.query(
        "INSERT INTO sales_vat(sale_id, company_code, company_name, invoice_no, party_id, party_name, served_by, phone, payment_mode, harlan_cash, material_id) VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11) RETURNING *;",
        [
          SaleId,
          CompanyCode,
          CompanyName,
          InvoiceNo,
          PartyId,
          PartyName,
          ServedBy,
          Phone,
          PaymentMode,
          HarlanCash,
          materialId,
        ]
      );

      // if (result.rows.length > 0) {
      // }
    }
    return res.status(200).json({ message: "Successfully added!" });
  } catch (error) {
    next(error);
  }

  return res.status(400).send("Failed to add sales with MaterialIds provided.");
});

// router.get("/salesMaster", async (req, res, next) => {
//   await pool.query("SELECT * FROM banks;", (error, result) => {
//     try {
//       if (error) throw error;
//       res.status(200).send(result.rows);
//     } catch (err) {
//       next(err);
//     }
//   });
// });

router.get("/sales/view", async (req, res, next) => {
  await pool.query("SELECT * FROM banks;", (error, result) => {
    try {
      if (error) throw error;
      res.status(200).send(result.rows);
    } catch (err) {
      next(err);
    }
  });
});

router.delete("/delete/:bank_id", async (req, res, next) => {
  const bankId = req.params.bank_id;
  //const now = new Date();

  await pool.query(
    "DELETE FROM banks WHERE bank_id = $1",
    [bankId],
    (error, result) => {
      try {
        if (error) throw error;

        res.status(200).json(`Deleted with BankId: ${bankId}`);
      } catch (err) {
        next(err);
      }
    }
  );
});

module.exports = router;
