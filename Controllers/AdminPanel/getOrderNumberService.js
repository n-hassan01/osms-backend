const express = require("express");
const pool = require("../../dbConnection");
const router = express.Router();

router.post("/", async (req, res, next) => {
 
   const start=req.body.obj.start;
   const end=req.body.obj.end;
    console.log("start",start);
    console.log("end",end);
  await pool.query(
    "SELECT MAX(order_number) FROM oe_order_headers_all   WHERE order_number >= $1 AND order_number < $2;",
    [start,end],

    (error, result) => {
      try {
        if (error) {
          console.log(error.message);
          throw error;}

        res.status(200).json(result.rows);
      } catch (err) {
        next(err);
      }
    }
  );
});

module.exports = router;
