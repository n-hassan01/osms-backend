const express = require("express");
const pool = require("../../dbConnection");
const router = express.Router();

router.delete("/:transaction_type_id", async (req, res, next) => {
  const transactionTypeId = req.params.transaction_type_id;
  //const now = new Date();

  await pool.query(
    "DELETE FROM mtl_transaction_types WHERE transaction_type_id = $1",
    [transactionTypeId],
    (error, result) => {
      try {
        if (error) throw error;

        res
          .status(200)
          .json(
            `MltTransactionType Deleted with transactionTypeId: ${transactionTypeId}`
          );
      } catch (err) {
        next(err);
      }
    }
  );
});

module.exports = router;
