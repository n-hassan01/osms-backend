const express = require("express");
const pool = require("../../dbConnection");
const router = express.Router();

router.post("/view/filterByDate", async (req, res, next) => {
  const { toDate, fromDate } = req.body;

  await pool.query(
    "SELECT * FROM public.sales_details_all WHERE order_date BETWEEN $1 AND $2 ORDER BY order_date ASC",
    [fromDate, toDate],
    (error, result) => {
      try {
        if (error) throw error;
        res.status(200).send(result.rows);
      } catch (err) {
        next(err);
      }
    }
  );
});

router.post("/view/filterByFromDate", async (req, res, next) => {
  const { fromDate } = req.body;

  await pool.query(
    "SELECT * FROM public.sales_details_all WHERE order_date >= $1",
    [fromDate],
    (error, result) => {
      try {
        if (error) throw error;
        res.status(200).send(result.rows);
      } catch (err) {
        next(err);
      }
    }
  );
});

router.post("/view/filterByToDate", async (req, res, next) => {
  const { toDate } = req.body;

  await pool.query(
    "SELECT * FROM public.sales_details_all WHERE order_date <= $1",
    [toDate],
    (error, result) => {
      try {
        if (error) throw error;
        res.status(200).send(result.rows);
      } catch (err) {
        next(err);
      }
    }
  );
});
module.exports = router;
