const express = require("express");
const Joi = require("joi");
const pool = require("../../dbConnection");
const router = express.Router();

router.get("/view", async (req, res, next) => {
  await pool.query(
    "SELECT * FROM sales_achvied_targets_sku_all_v;",
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
