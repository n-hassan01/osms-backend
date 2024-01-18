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

module.exports = router;
