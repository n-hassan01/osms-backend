const Joi = require("joi");
const express = require("express");
const pool = require("../../dbConnection");
const router = express.Router();

router.post("/", async (req, res, next) => {
  console.log("body", req.body);
  const schema = Joi.array().items(
    Joi.object({
      cashReceiptId: Joi.number(),
      //   status: Joi.string(),
      depositDate: Joi.string(),
      //   entryDate: Joi.string(),
      //   companyBank: Joi.string(),
      //   companyAccount: Joi.string(),
      //   companyName: Joi.string(),
      payFromCustomer: Joi.number(),
      //   customerName: Joi.string(),
      //   customerGroup: Joi.string(),
      amount: Joi.number(),
      //   invoiceNumber: Joi.string(),
      //   depositType: Joi.string(),
      //   depositFromBank: Joi.string(),
      //   depositFromBranch: Joi.string(),
      //   receiptNumber: Joi.string(),
      glDate: Joi.string(),
      glAmount: Joi.number(),
      //   depositor: Joi.string().max(200),
      //   employee: Joi.string().max(200),
      //   userName: Joi.string().max(200),
      //   remarks: Joi.string().max(200),
    })
  );
  console.log("schema", schema);

  const validation = schema.validate(req.body);

  if (validation.error) {
    console.log(validation.error.message);
    return res.status(400).send("Bad Request");
  }

  try {
    const data = req.body;
    let result;
    for (const item of data) {
      const { cashReceiptId, amount, glDate } = item;
      result = await pool.query(
        "CALL public.proc_bank_recon_process($1,$2, $3)",
        [cashReceiptId, glDate, amount]
      );
      console.log("hool", result.rows);
    }
    res.json(result.rows);
  } catch (error) {
    console.error(error);
    next(error);
  }
});

module.exports = router;
