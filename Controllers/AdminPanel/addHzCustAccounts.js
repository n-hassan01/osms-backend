const Joi = require("joi");
const express = require("express");
const pool = require("../../dbConnection");
const router = express.Router();

router.post("/", async (req, res, next) => {
  const schema = Joi.object({
    lastUpdateDate: Joi.string().min(0),
    accountNumber: Joi.string().max(30).required(),
    lastUpdatedBy: Joi.number().required(),
    creationDate: Joi.string().min(0),
    createdBy: Joi.number().required(),
    lastUpdateLogin: Joi.number(),
    customerType: Joi.string().max(30),
    customerClassCode: Joi.string().max(30),
    accountName: Joi.string().max(240),
    primarySalesrepId: Joi.number(),
    salesChannelCode: Joi.string().max(30),
    emailAddress:Joi.string().max(240),
    workTelephone :Joi.string().max(30) 
  });
  const validation = schema.validate(req.body);
  if (validation.error) {
    console.log(validation.error.message);
    res.status(400).send("Invalid inputs");
  } else {
    const {
      lastUpdateDate,
      accountNumber,
      lastUpdatedBy,
      creationDate,
      createdBy,
      lastUpdateLogin,
      customerType,
      customerClassCode,
      primarySalesrepId,
      salesChannelCode,
      orderTypeId,
      priceListId,
      subcategoryCode,
      paymentTermId,
      accountName,
      emailAddress,
      workTelephone
    } = req.body;

    await pool.query(
      "INSERT INTO hz_cust_accounts (last_update_date,account_number,last_updated_by,creation_date,created_by, last_update_login ,customer_type,customer_class_code,primary_salesrep_id,sales_channel_code,order_type_id,price_list_id,subcategory_code,payment_term_id,account_name,email_address,work_telephone) VALUES ($1, $2,$3,$4,$5,$6,$7,$8,$9,$10,$11,$12,$13,$14,$15,$16,$17)",
      [
        lastUpdateDate,
        accountNumber,
        lastUpdatedBy,
        creationDate,
        createdBy,
        lastUpdateLogin,
        customerType,
        customerClassCode,
        primarySalesrepId,
        salesChannelCode,
        orderTypeId,
        priceListId,
        subcategoryCode,
        paymentTermId,
        accountName,
        emailAddress,
        workTelephone
      ],
      (error, result) => {
        try {
          if (error) throw error;

          res.status(200).json({ message: "Successfully completed adding" });
        } catch (err) {
          next(err);
        }
      }
    );
  }
});

module.exports = router;
