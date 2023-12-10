const express = require("express");
const pool = require("../../dbConnection");
const router = express.Router();

router.delete("/:order_number", async (req, res, next) => {
  const orderNumber = req.params.order_number;
  await pool.query(
    "DELETE FROM oe_order_headers_all WHERE order_number = $1",
    [orderNumber],
    (error, result) => {
      try {
        if (error) throw error;

        res.status(200).json({ message: "Successfully Deleted" });
      } catch (err) {
        next(err);
      }
    }
  );
});

module.exports = router;
