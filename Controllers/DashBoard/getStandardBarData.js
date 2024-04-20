const express = require("express");
const Joi = require("joi");
const pool = require("../../dbConnection");
const router = express.Router();


router.get("/view", async (req, res, next) => {
  await pool.query("SELECT header_id, COUNT(*) AS line_count FROM public.oe_order_lines_all GROUP BY header_id ORDER BY header_id ASC;", (error, result) => {
    try {
      if (error) throw error;
      res.status(200).send(result.rows);
    } catch (err) {
      next(err);
    }
  });
});


module.exports = router;
