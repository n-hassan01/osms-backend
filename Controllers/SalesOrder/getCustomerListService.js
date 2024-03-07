const express = require("express");
const pool = require("../../dbConnection");
const router = express.Router();

router.get("/", async (req, res, next) => {
  const primarySalesrepCode = req.id;

  await pool.query(
    "SELECT cust_account_id, account_number, full_name, ship_to_address FROM hz_cust_accounts where primary_salesrep_code=$1;",
    [primarySalesrepCode],
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

router.get("/:customer_group", async (req, res, next) => {
  const customerGroup = req.params.customer_group;

  await pool.query(
    "SELECT cust_account_id, account_number, full_name, ship_to_address FROM hz_cust_accounts where customer_group=$1;",
    [customerGroup],
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

router.get("/customerGroup/list", async (req, res, next) => {
  await pool.query(
    "SELECT DISTINCT customer_group FROM hz_cust_accounts;",
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

module.exports = router;
