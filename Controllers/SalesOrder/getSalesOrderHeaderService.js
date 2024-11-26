const express = require("express");
const pool = require("../../dbConnection");

const router = express.Router();

router.get("/", async (req, res, next) => {
  await pool.query(
    "SELECT * FROM public.oe_order_headers_all ORDER BY header_id ASC;",
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

router.get("/:header_id", async (req, res, next) => {
  const headerId = req.params.header_id;

  await pool.query(
    "SELECT * FROM public.oe_order_headers_all WHERE header_id=$1;",
    [headerId],
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

router.get("/by-user/:user_id", async (req, res, next) => {
  const userId = req.params.user_id;

  await pool.query(
    "SELECT * FROM public.oe_order_headers_all WHERE created_by=$1 ORDER BY order_number DESC;",
    [userId],
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

router.post("/filterByDate", async (req, res, next) => {
  const { fromDate, toDate, userId } = req.body;
  try {
    await pool.query(
      "SELECT * FROM public.oe_order_headers_all WHERE creation_date BETWEEN $1 AND $2 AND created_by=$3 ORDER BY order_number DESC;",
      [fromDate, toDate, userId],
      (error, result) => {
        try {
          if (error) throw error;

          res.status(200).json(result.rows);
        } catch (err) {
          next(err);
        }
      }
    );
  } catch (err) {
    next(err);
  }
});

// router.get("/admin", async (req, res, next) => {
//   const userId = req.params.user_id;

//   await pool.query(
//     "SELECT * FROM public.oe_order_headers_all WHERE created_by=$1 ORDER BY order_number DESC;",
//     [userId],
//     (error, result) => {
//       try {
//         if (error) throw error;
//         res.status(200).send(result.rows);
//       } catch (err) {
//         next(err);
//       }
//     }
//   );
// });

module.exports = router;
