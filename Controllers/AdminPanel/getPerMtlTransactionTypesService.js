const express = require("express");
const pool = require("../../dbConnection");
const router = express.Router();

router.get("/:transaction_type_id", async (req, res, next) => {
    const transactionTypeId = req.params.transaction_type_id;
  await pool.query(
    "SELECT * FROM mtl_transaction_types where transaction_type_id= $1",
    [transactionTypeId],

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
