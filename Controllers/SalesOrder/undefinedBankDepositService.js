const express = require("express");
const pool = require("../../dbConnection");
const router = express.Router();

router.get("/", async (req, res, next) => {
  await pool.query(
    "SELECT * FROM public.unidentified_bank_deposits;",
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

router.get("/view", async (req, res, next) => {
  await pool.query(
    "SELECT * FROM public.customer_deposit_claimed_identified_v;",
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
    documentNumber: Joi.number().allow(null),
    bankStmDate: Joi.string().min(0),
    companyCode: Joi.string().min(0).max(10),
    bankName: Joi.string().min(0).max(100),
    bankAccountNum: Joi.string().min(0).max(100),
    description: Joi.string().min(0).max(200),
    amount: Joi.string().min(0),
    remarks: Joi.string().min(0).max(250),
    status: Joi.string().min(0).max(20),
  });

  const validation = schema.validate(req.body);

  if (validation.error) {
    console.log(validation.error);

    return res.status(400).send("Invalid inputs");
  }

  const {
    documentNumber,
    bankStmDate,
    companyCode,
    bankName,
    bankAccountNum,
    description,
    amount,
    remarks,
    status,
  } = req.body;

  const date = new Date();

  await pool.query(
    "INSERT INTO public.unidentified_bank_deposits(document_number, bank_stm_date, company_code, bank_name, bank_account_num, description, amount, remarks, status) VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9);",
    [
      documentNumber,
      bankStmDate,
      companyCode,
      bankName,
      bankAccountNum,
      description,
      amount,
      remarks,
      status,
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

router.delete("/delete/:document_number", async (req, res, next) => {
  const documentNumber = req.params.document_number;
  await pool.query(
    "DELETE FROM unidentified_bank_deposits WHERE document_number = $1",
    [documentNumber],
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

router.put("/update", async (req, res, next) => {
  const schema = Joi.object({
    documentNumber: Joi.number().allow(null),
    bankStmDate: Joi.string().min(0),
    companyCode: Joi.string().min(0).max(10),
    bankName: Joi.string().min(0).max(100),
    bankAccountNum: Joi.string().min(0).max(100),
    description: Joi.string().min(0).max(200),
    amount: Joi.string().min(0),
    remarks: Joi.string().min(0).max(250),
    status: Joi.string().min(0).max(20),
  });

  const validation = schema.validate(req.body);

  if (validation.error) {
    console.log(validation.error);

    return res.status(400).send("Invalid inputs");
  }

  const {
    documentNumber,
    bankStmDate,
    companyCode,
    bankName,
    bankAccountNum,
    description,
    amount,
    remarks,
    status,
  } = req.body;

  const date = new Date();

  await pool.query(
    "UPDATE public.unidentified_bank_deposits SET SET bank_stm_date=$1, company_code=$2, bank_name=$3, bank_account_num=$4, description=$5, amount=$6, remarks=$7, status=$8 WHERE document_number=$9;",
    [
      bankStmDate,
      companyCode,
      bankName,
      bankAccountNum,
      description,
      amount,
      remarks,
      status,
      documentNumber,
    ],
    (error, result) => {
      try {
        if (error) throw error;

        return res.status(200).json({ message: "Successfully updated!" });
      } catch (err) {
        next(err);
      }
    }
  );
});

router.post("/uploadExcel", async (req, res, next) => {
  //   const schema = Joi.array().items(
  //     Joi.object({
  //       document_number: Joi.number().allow(null),
  //       bank_stm_date: Joi.string().min(0),
  //       company_code: Joi.string().min(0).max(10),
  //       bank_name: Joi.string().min(0).max(100),
  //       bank_account_num: Joi.string().min(0).max(100),
  //       description: Joi.string().min(0).max(200),
  //       amount: Joi.string().min(0),
  //       remarks: Joi.string().min(0).max(250),
  //       status: Joi.string().min(0).max(20),
  //     })
  //   );
  //   console.log("schema", schema);

  //   const validation = schema.validate(req.body);

  //   if (validation.error) {
  //     console.log(validation.error.message);
  //     return res.status(400).send("Bad Request");
  //   }

  try {
    const data = req.body;
    let result;
    for (const item of data) {
      const {
        document_number,
        bank_stm_date,
        company_code,
        bank_name,
        bank_account_num,
        description,
        amount,
        remarks,
      } = item;

      result = await pool.query(
        "CALL public.proc_unidentified_deposits_upload_process($1, $2, $3, $4, $5, $6, $7, $8)",
        [
          document_number,
          bank_stm_date,
          company_code,
          bank_name,
          bank_account_num,
          description,
          amount,
          remarks,
        ]
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
