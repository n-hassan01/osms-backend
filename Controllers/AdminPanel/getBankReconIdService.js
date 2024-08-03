const express = require("express");
const pool = require("../../dbConnection");
const router = express.Router();

router.get("/all", async (req, res, next) => {
  await pool.query(
    "SELECT code,short_name FROM fnd_lookup_bank_recon_code_v",

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
