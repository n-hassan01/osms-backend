const express = require("express");
const Joi = require("joi");
const pool = require("../../dbConnection");
const router = express.Router();

// router.post("/add", async (req, res, next) => {
//   const {
//     last_update_date,
//     last_updated_by,
//     vendor_id,
//     invoice_num,
//     set_of_books_id,
//     invoice_currency_code,
//     payment_currency_code,
//     payment_cross_rate,
//     invoice_amount,
//     vendor_site_id,
//     amount_paid,
//     discount_amount_taken,
//     invoice_date,
//     source,
//     invoice_type_lookup_code,
//     description,
//     batch_id,
//     amount_applicable_to_discount,
//     tax_amount,
//     terms_id,
//     terms_date,
//     payment_method_lookup_code,
//     pay_group_lookup_code,
//     accts_pay_code_combination_id,
//     payment_status_flag,
//     creation_date,
//     created_by,
//     base_amount,
//     vat_code,
//     last_update_login,
//     exclusive_payment_flag,
//     po_header_id,
//     freight_amount,
//     goods_received_date,
//     invoice_received_date,
//     voucher_num,
//     approved_amount,
//     recurring_payment_id,
//     exchange_rate,
//     exchange_rate_type,
//     exchange_date,
//     earliest_settlement_date,
//     original_prepayment_amount,
//     doc_sequence_id,
//     doc_sequence_value,
//     doc_category_code,
//     attribute1,
//     attribute2,
//     attribute3,
//     attribute4,
//     attribute5,
//     attribute_category,
//     approval_status,
//     approval_description,
//     invoice_distribution_total,
//     posting_status,
//     prepay_flag,
//     authorized_by,
//     cancelled_date,
//     cancelled_by,
//     cancelled_amount,
//     temp_cancelled_amount,
//     project_id,
//     task_id,
//     expenditure_type,
//     expenditure_item_date,
//     expenditure_organization_id,
//     vendor_prepay_amount,
//     payment_amount_total,
//     org_id,
//     pre_withholding_amount,
//     global_attribute_category,
//     global_attribute1,
//     global_attribute2,
//     global_attribute3,
//     global_attribute4,
//     global_attribute5,
//     gl_date,
//     application_id,
//   } = req.body;

//   try {
//     const primaryKey = await getPrimaryKey(
//       "cash_receipt_id",
//       "ar_cash_receipts_all"
//     );

//     const date = new Date();

//     await pool.query(
//       "INSERT INTO public.ap_invoices_all(invoice_id, last_update_date, last_updated_by, vendor_id, invoice_num, set_of_books_id, invoice_currency_code, payment_currency_code, payment_cross_rate, invoice_amount, vendor_site_id, amount_paid, discount_amount_taken, invoice_date, source, invoice_type_lookup_code, description, batch_id, amount_applicable_to_discount, tax_amount, terms_id, terms_date, payment_method_lookup_code, pay_group_lookup_code, accts_pay_code_combination_id, payment_status_flag, creation_date, created_by, base_amount, vat_code, last_update_login, exclusive_payment_flag, po_header_id, freight_amount, goods_received_date, invoice_received_date, voucher_num, approved_amount, recurring_payment_id, exchange_rate, exchange_rate_type, exchange_date, earliest_settlement_date, original_prepayment_amount, doc_sequence_id, doc_sequence_value, doc_category_code, attribute1, attribute2, attribute3, attribute4, attribute5, attribute_category, approval_status, approval_description, invoice_distribution_total, posting_status, prepay_flag, authorized_by, cancelled_date, cancelled_by, cancelled_amount, temp_cancelled_amount, project_id, task_id, expenditure_type, expenditure_item_date, expenditure_organization_id, vendor_prepay_amount, payment_amount_total, org_id, pre_withholding_amount, global_attribute_category, global_attribute1, global_attribute2, global_attribute3, global_attribute4, global_attribute5, gl_date, application_id) VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12, $13, $14, $15, $16, $17, $18, $19, $20, $21, $22, $23, $24, $25, $26, $27, $28, $29, $30, $31, $, $1, $1, $1, $1, $1, $1, $1, $1, $1, $1, $1, $1, $1, $1, $1, $1, $1, $1, $1, $1, $1, $1, $1, $1, $1, $1, $1, $1, $1, $1, $1, $1, $1, $1, $1, $1, $1, $1, $1, $1, $1, $1, $1, $1, $1, $1, $1, $1); RETURNING *;",
//       [
//         primaryKey,
//         last_update_date,
//         last_updated_by,
//         vendor_id,
//         invoice_num,
//         set_of_books_id,
//         invoice_currency_code,
//         payment_currency_code,
//         payment_cross_rate,
//         invoice_amount,
//         vendor_site_id,
//         amount_paid,
//         discount_amount_taken,
//         invoice_date,
//         source,
//         invoice_type_lookup_code,
//         description,
//         batch_id,
//         amount_applicable_to_discount,
//         tax_amount,
//         terms_id,
//         terms_date,
//         payment_method_lookup_code,
//         pay_group_lookup_code,
//         accts_pay_code_combination_id,
//         payment_status_flag,
//         creation_date,
//         created_by,
//         base_amount,
//         vat_code,
//         last_update_login,
//         exclusive_payment_flag,
//         po_header_id,
//         freight_amount,
//         goods_received_date,
//         invoice_received_date,
//         voucher_num,
//         approved_amount,
//         recurring_payment_id,
//         exchange_rate,
//         exchange_rate_type,
//         exchange_date,
//         earliest_settlement_date,
//         original_prepayment_amount,
//         doc_sequence_id,
//         doc_sequence_value,
//         doc_category_code,
//         attribute1,
//         attribute2,
//         attribute3,
//         attribute4,
//         attribute5,
//         attribute_category,
//         approval_status,
//         approval_description,
//         invoice_distribution_total,
//         posting_status,
//         prepay_flag,
//         authorized_by,
//         cancelled_date,
//         cancelled_by,
//         cancelled_amount,
//         temp_cancelled_amount,
//         project_id,
//         task_id,
//         expenditure_type,
//         expenditure_item_date,
//         expenditure_organization_id,
//         vendor_prepay_amount,
//         payment_amount_total,
//         org_id,
//         pre_withholding_amount,
//         global_attribute_category,
//         global_attribute1,
//         global_attribute2,
//         global_attribute3,
//         global_attribute4,
//         global_attribute5,
//         gl_date,
//         application_id,
//       ],
//       (error, result) => {
//         try {
//           if (error) throw error;

//           return res.status(200).json({ message: "Successfully added!" });
//         } catch (err) {
//           next(err);
//         }
//       }
//     );
//   } catch (error) {
//     console.error("Error fetching primary key:", err.message);
//   }
// });

router.get("/", async (req, res, next) => {
  await pool.query("SELECT * FROM ap_invoices_all;", (error, result) => {
    try {
      if (error) throw error;
      res.status(200).send(result.rows);
    } catch (err) {
      next(err);
    }
  });
});

// router.put("/update/:bank_id", async (req, res, next) => {
//   const bankId = req.params.bank_id;

//   const schema = Joi.object({
//     bankCode: Joi.string().max(30),
//     bankName: Joi.string().max(60).required(),
//     bankNameAlt: Joi.string().max(320).allow(null),
//     description: Joi.string().max(240).allow(null),
//     addressLine1: Joi.string().max(35).allow(null),
//     city: Joi.string().max(25).allow(null),
//     lastUpdateDate: Joi.string().required(),
//     lastUpdatedBy: Joi.number().required(),
//     lastUpdateLogin: Joi.number(),
//     creationDate: Joi.string(),
//     createdBy: Joi.number(),
//   });

//   const validation = schema.validate(req.body);
//   if (validation.error) {
//     console.log(validation.error.message);

//     return res.status(400).send("Invalid inputs");
//   }

//   const {
//     bankCode,
//     bankName,
//     bankNameAlt,
//     description,
//     addressLine1,
//     city,
//     lastUpdateDate,
//     lastUpdatedBy,
//     lastUpdateLogin,
//     creationDate,
//     createdBy,
//   } = req.body;

//   const date = new Date();

//   await pool.query(
//     "UPDATE banks SET bank_code=$1, bank_name=$2, bank_name_alt=$3, description=$4, address_line1=$5, city=$6, last_update_date=$7, last_updated_by=$8,  last_update_login=$9, creation_date=$10, created_by=$11 WHERE bank_id=$12;",
//     [
//       bankCode,
//       bankName,
//       bankNameAlt,
//       description,
//       addressLine1,
//       city,
//       lastUpdateDate,
//       lastUpdatedBy,
//       lastUpdateLogin,
//       creationDate,
//       createdBy,
//       bankId,
//     ],
//     (error, result) => {
//       try {
//         if (error) throw error;

//         return res.status(200).json({
//           message: "Successfully updated!",
//           headerInfo: result.rows[0],
//         });
//       } catch (err) {
//         next(err);
//       }
//     }
//   );
// });

router.delete("/delete/:invoice_id", async (req, res, next) => {
  const invoiceId = req.params.invoice_id;

  await pool.query(
    "DELETE FROM ap_invoices_all WHERE invoice_id = $1",
    [invoiceId],
    (error, result) => {
      try {
        if (error) throw error;

        res.status(200).json(`Deleted successfully!`);
      } catch (err) {
        next(err);
      }
    }
  );
});

module.exports = router;
