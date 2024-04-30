const express = require("express");
const Joi = require("joi");
const pool = require("../../dbConnection");
const router = express.Router();

router.get("/view", async (req, res, next) => {
  await pool.query(
    "SELECT  sum(amount), deposit_type_name, company_name,company_account,  customer_name FROM public.customer_deposit_all_v Group by deposit_type_name,   company_bank, company_account, company_name, employee_name, customer_deposit_all_v.customer_name",
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

router.get("/view/customerDepositAnalytic", async (req, res, next) => {
  await pool.query(
    "select * from customer_deposit_analytic_1",
    (error, result) => {
      try {
        if (error) throw error;
        res.status(200).send(result.rows);
        console.log(result);
      } catch (err) {
        next(err);
      }
    }
  );
});

module.exports = router;
