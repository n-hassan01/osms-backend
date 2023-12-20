const express = require("express");
const pool = require("../../dbConnection");
const router = express.Router();

router.get("/:cust_account_id", async (req, res, next) => {
    const custAccountId = req.params.cust_account_id;
  await pool.query(
    "SELECT * FROM hz_cust_accounts where cust_account_id= $1",
    [custAccountId],

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
