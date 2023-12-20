const express = require("express");
const pool = require("../../dbConnection");
const router = express.Router();

router.delete("/:cust_account_id", async (req, res, next) => {
    const custAccountId = req.params.cust_account_id;
  //const now = new Date();

  await pool.query(
    "DELETE FROM hz_cust_accounts WHERE cust_account_id = $1",
    [custAccountId],
    (error, result) => {
      try {
        if (error) throw error;

        res
          .status(200)
          .json(`Deleted with custAccountId: ${custAccountId}`);
      } catch (err) {
        next(err);
      }
    }
  );
});

module.exports = router;
