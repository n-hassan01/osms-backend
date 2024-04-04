const express = require("express");
const Joi = require("joi");
const pool = require("../../dbConnection");
const multer = require("multer");
const path = require("path");
const { env } = require("process");

const router = express.Router();

router.post("/add", async (req, res, next) => {
  const schema = Joi.object({
    customerBankAccountId: Joi.number().allow(null),
    customerBankBranchId: Joi.number().allow(null),
    receiptNumber: Joi.string().min(0),
    receiptDate: Joi.string().min(0),
    depositDate: Joi.string().min(0),
    amount: Joi.string().min(0),
    remittanceBankAccountId: Joi.number().allow(null),
    legalEntityId: Joi.number().allow(null),
    ledgerId: Joi.number().allow(null),
    currencyCode: Joi.string().min(0).max(15),
    payFromCustomer: Joi.number().required(),
    receiptMethodId: Joi.string().min(0),
    docSequenceValue: Joi.string().min(0),
    docSequenceId: Joi.number().allow(null),
    status: Joi.string().min(0).max(30),
    anticipatedClearingDate: Joi.string().min(0),
    lastUpdatedBy: Joi.number().allow(null),
    // lastUpdateDate: Joi.string().min(0),
    createdBy: Joi.number().allow(null),
    depositorBank: Joi.number().allow(null),
    depositType: Joi.number().allow(null),
    // creationDate: Joi.string().min(0),
    uploadedFilename: Joi.string().min(0),
    remarks: Joi.string().min(0),
    depositor: Joi.string().min(0),
    invoiceNumber: Joi.string().min(0),
  });

  const validation = schema.validate(req.body);

  if (validation.error) {
    console.log(validation.error);

    return res.status(400).send("Invalid inputs");
  }

  const {
    customerBankAccountId,
    customerBankBranchId,
    receiptNumber,
    receiptDate,
    depositDate,
    amount,
    remittanceBankAccountId,
    legalEntityId,
    ledgerId,
    currencyCode,
    payFromCustomer,
    receiptMethodId,
    docSequenceValue,
    docSequenceId,
    status,
    anticipatedClearingDate,
    lastUpdatedBy,
    // lastUpdateDate,
    createdBy,
    // creationDate,
    uploadedFilename,
    depositorBank,
    depositType,
    remarks,
    depositor,
    invoiceNumber,
  } = req.body;

  const date = new Date();

  await pool.query(
    "INSERT INTO public.ar_cash_receipts_all(remittance_bank_account_id, company_cust_bank_branch_id, receipt_number, receipt_date, deposit_date, amount, legal_entity_id, ledger_id, currency_code, pay_from_customer, receipt_method_id, doc_sequence_value, doc_sequence_id, status, anticipated_clearing_date, last_updated_by, last_update_date, created_by, creation_date, uploaded_filename, company_cust_bank_id, deposit_type_id, remarks, depositor_name, invoice_number) VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12, $13, $14, $15, $16, $17, $18, $19, $20, $21, $22, $23, $24, $25);",
    [
      customerBankAccountId,
      customerBankBranchId,
      receiptNumber,
      receiptDate,
      depositDate,
      amount,
      // remittanceBankAccountId,
      legalEntityId,
      ledgerId,
      currencyCode,
      payFromCustomer,
      receiptMethodId,
      docSequenceValue,
      docSequenceId,
      // status,
      "NEW",
      anticipatedClearingDate,
      lastUpdatedBy,
      date,
      createdBy,
      date,
      uploadedFilename,
      depositorBank,
      depositType,
      remarks,
      depositor,
      invoiceNumber,
    ],
    (error, result) => {
      try {
        if (error) throw error;

        return res.status(200).json({ message: "Successfully added!" });
      } catch (err) {
        next(err);
      }
    }
  );
});

router.get("/get/:cash_receipt_id", async (req, res, next) => {
  const cashReceiptId = req.params.cash_receipt_id;

  await pool.query(
    "SELECT * FROM public.ar_cash_receipts_all WHERE cash_receipt_id=$1;",
    [cashReceiptId],
    (error, result) => {
      try {
        if (error) throw error;
        res.status(200).send(result.rows[0]);
      } catch (err) {
        next(err);
      }
    }
  );
});

router.get("/view/:cash_receipt_id", async (req, res, next) => {
  const cashReceiptId = req.params.cash_receipt_id;

  await pool.query(
    "SELECT * FROM public.customer_deposit_all_v WHERE cash_receipt_id=$1;",
    [cashReceiptId],
    (error, result) => {
      try {
        if (error) throw error;
        res.status(200).send(result.rows[0]);
      } catch (err) {
        next(err);
      }
    }
  );
});

router.get("/get/view/:user_id", async (req, res, next) => {
  const userId = req.params.user_id;

  await pool.query(
    // "SELECT * FROM public.customer_deposit_all_v WHERE created_by=$1;",
    "SELECT * FROM customer_deposit_all_v WHERE creation_date >= CURRENT_DATE - INTERVAL '30 days' AND created_by=$1 ORDER BY deposit_date DESC;",
    [userId],
    (error, result) => {
      try {
        if (error) throw error;
        res.status(200).send(result.rows);
      } catch (err) {
        next(err);
      }
    }
  );
});

router.put("/reject", async (req, res, next) => {
  await pool.query(
    "UPDATE public.ar_cash_receipts_all SET reject_reason=$1 WHERE cash_receipt_id=$2;",
    [req.body.rejectReason, req.body.cashReceiptId],
    (error, result) => {
      try {
        if (error) throw error;

        res.status(200).json({ message: "Successfully rejected!" });
      } catch (err) {
        next(err);
      }
    }
  );
});

router.get("/customer/view", async (req, res, next) => {
  await pool.query(
    "SELECT * FROM public.customer_deposit_all_v ORDER BY deposit_date DESC;",
    (error, result) => {
      try {
        if (error) throw error;
        res.status(200).send(result.rows);
      } catch (err) {
        next(err);
      }
    }
  );
});

router.post("/customer/view/filterByDate", async (req, res, next) => {
  const { toDepositDate, fromDepositDate } = req.body;

  await pool.query(
    "SELECT * FROM public.customer_deposit_all_v WHERE deposit_date BETWEEN $1 AND $2",
    [fromDepositDate, toDepositDate],
    (error, result) => {
      try {
        if (error) throw error;
        res.status(200).send(result.rows);
      } catch (err) {
        next(err);
      }
    }
  );
});

router.post("/customer/view/filterByFromDate", async (req, res, next) => {
  const { fromDepositDate } = req.body;

  await pool.query(
    "SELECT * FROM public.customer_deposit_all_v WHERE deposit_date >= $1",
    [fromDepositDate],
    (error, result) => {
      try {
        if (error) throw error;
        res.status(200).send(result.rows);
      } catch (err) {
        next(err);
      }
    }
  );
});

router.post("/customer/view/filterByToDate", async (req, res, next) => {
  const { toDepositDate } = req.body;

  await pool.query(
    "SELECT * FROM public.customer_deposit_all_v WHERE deposit_date <= $1",
    [toDepositDate],
    (error, result) => {
      try {
        if (error) throw error;
        res.status(200).send(result.rows);
      } catch (err) {
        next(err);
      }
    }
  );
});

router.put("/approve/", async (req, res, next) => {
  const { action, cashReceiptId } = req.body;

  await pool.query(
    "UPDATE public.ar_cash_receipts_all SET status=$1 WHERE cash_receipt_id=$2;",
    [action, cashReceiptId],
    (error, result) => {
      try {
        if (error) throw error;

        res.status(200).json({ message: "Successfully updated!" });
      } catch (err) {
        next(err);
      }
    }
  );
});

router.get("/get/user/:user_id", async (req, res, next) => {
  const userId = req.params.user_id;

  await pool.query(
    "SELECT * FROM public.ar_cash_receipts_all WHERE created_by=$1;",
    [userId],
    (error, result) => {
      try {
        if (error) throw error;
        res.status(200).send(result.rows);
      } catch (err) {
        next(err);
      }
    }
  );
});

router.delete("/delete/:cash_receipt_id", async (req, res, next) => {
  const cashReceiptId = req.params.cash_receipt_id;
  await pool.query(
    "DELETE FROM ar_cash_receipts_all WHERE cash_receipt_id = $1",
    [cashReceiptId],
    (error, result) => {
      try {
        if (error) throw error;

        res.status(200).json({ message: "Successfully Deleted" });
      } catch (err) {
        next(err);
      }
    }
  );
});

router.put("/update/:cash_receipt_id", async (req, res, next) => {
  const cashReceiptId = req.params.cash_receipt_id;

  const schema = Joi.object({
    customerBankAccountId: Joi.number().allow(null),
    customerBankBranchId: Joi.number().allow(null),
    receiptNumber: Joi.string().min(0),
    receiptDate: Joi.string().min(0),
    depositDate: Joi.string().min(0),
    amount: Joi.string().min(0),
    remittanceBankAccountId: Joi.number().allow(null),
    legalEntityId: Joi.number().allow(null),
    ledgerId: Joi.number().allow(null),
    currencyCode: Joi.string().min(0).max(15),
    payFromCustomer: Joi.string().min(0),
    receiptMethodId: Joi.string().min(0),
    docSequenceValue: Joi.string().min(0),
    docSequenceId: Joi.number().allow(null),
    status: Joi.string().min(0).max(30),
    anticipatedClearingDate: Joi.string().min(0),
    lastUpdatedBy: Joi.number().allow(null),
    // lastUpdateDate: Joi.string().min(0),
    createdBy: Joi.number().allow(null),
  });

  const validation = schema.validate(req.body);

  if (validation.error) {
    console.log(validation.error);

    return res.status(400).send("Invalid inputs");
  }

  const {
    customerBankAccountId,
    customerBankBranchId,
    receiptNumber,
    receiptDate,
    depositDate,
    amount,
    remittanceBankAccountId,
    legalEntityId,
    ledgerId,
    currencyCode,
    payFromCustomer,
    receiptMethodId,
    docSequenceValue,
    docSequenceId,
    status,
    anticipatedClearingDate,
    lastUpdatedBy,
  } = req.body;

  const date = new Date();

  await pool.query(
    "UPDATE public.ar_cash_receipts_all SET company_cust_bank_id=$1, company_cust_bank_branch_id=$2, receipt_number=$3, receipt_date=$4, deposit_date=$5, amount=$6, remittance_bank_account_id=$7, legal_entity_id=$8, ledger_id=$9, currency_code=$10, pay_from_customer=$11, receipt_method_id=$12, doc_sequence_value=$13, doc_sequence_id=$14, status=$15, anticipated_clearing_date=$16, last_updated_by=$17, last_update_date=$18 WHERE cash_receipt_id=$19;",
    [
      customerBankAccountId,
      customerBankBranchId,
      receiptNumber,
      receiptDate,
      depositDate,
      amount,
      remittanceBankAccountId,
      legalEntityId,
      ledgerId,
      currencyCode,
      payFromCustomer,
      receiptMethodId,
      docSequenceValue,
      docSequenceId,
      status,
      anticipatedClearingDate,
      lastUpdatedBy,
      date,
      cashReceiptId,
    ],
    (error, result) => {
      try {
        if (error) throw error;

        return res.status(200).json({ message: "Successfully added!" });
      } catch (err) {
        next(err);
      }
    }
  );
});

const coverStorage = multer.diskStorage({
  destination(req, file, cb) {
    cb(null, path.join(__dirname, process.env.DEPOSIT_PATH));
  },
  filename(req, file, cb) {
    console.log(file);

    cb(null, `deposit_${file.originalname}`);
  },
});

const coverUpload = multer({ storage: coverStorage });

router.post("/upload", coverUpload.single("file"), async (req, res, next) => {
  const fileInfo = req.file;

  if (fileInfo) {
    try {
      res
        .status(200)
        .send({ message: "Uploaded successfully!", value: fileInfo.filename });
    } catch (error) {
      console.error(error.message);
      next(error);
    }
  } else {
    res.status(400).send({ message: "File not provided or upload failed!" });
  }
});

router.post("/download", (req, res) => {
  const location = process.env.DEPOSIT_PATH;
  const filename = req.body.fileName;
  console.log(location);
  console.log(filename);

  const filePath = path.join(__dirname, location, filename);
  // res.download(`${location}${filename}`, filename);
  res.download(filePath, filename);
});

router.get("/type-list", async (req, res, next) => {
  await pool.query("SELECT * FROM public.deposit_type;", (error, result) => {
    try {
      if (error) throw error;
      res.status(200).send(result.rows);
    } catch (err) {
      next(err);
    }
  });
});

router.get("/company-bank-account/view", async (req, res, next) => {
  await pool.query("SELECT * FROM public.bank_accounts_v;", (error, result) => {
    try {
      if (error) throw error;
      res.status(200).send(result.rows);
    } catch (err) {
      next(err);
    }
  });
});

module.exports = router;
