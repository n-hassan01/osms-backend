const express = require("express");
const pool = require("../../dbConnection");
const router = express.Router();

router.delete("/:line_id", async (req, res, next) => {
  const lineId = req.params.line_id;
  console.log(lineId);
  

  await pool.query(
    "DELETE FROM mtl_txn_request_lines WHERE line_id = $1",
    [lineId],
    (error, result) => {
      try {
        if (error) throw error;

        res.status(200).send({ message: "Successfully deleted" });
      } catch (err) {
        next(err);
      }
    }
  );
});

module.exports = router;
