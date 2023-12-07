const express = require("express");
const pool = require("../../dbConnection");

const router = express.Router();

router.get("/", async (req, res, next) => {
  await pool.query(
    "SELECT * FROM public.oe_order_headers_all ORDER BY header_id ASC;",
    (error, result) => {
      try {
        if (error) throw error;
        res.status(200).send(result.rows[0]);
      } catch (err) {
        next(err);
      }
    }
  );
});

router.get("/:order_number", async (req, res, next) => {
  const orderNumber = req.params.order_number;

  await pool.query(
    "SELECT * FROM public.oe_order_headers_all WHERE order_number=$1;",
    [orderNumber],
    (error, result) => {
      try {
        if (error) throw error;
        res.status(200).send(result.rows[0]);
      } catch (err) {
        next(err);
      }
    }
  );
});

module.exports = router;
