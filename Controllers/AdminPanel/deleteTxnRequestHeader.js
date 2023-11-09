const express = require("express");
const pool = require("../../dbConnection");
const router = express.Router();

router.delete("/:header_id", async (req, res, next) => {
  const headerId = req.params.header_id;

  await pool.query(
    "DELETE FROM mtl_txn_request_headers WHERE header_id = $1",
    [headerId],
    (error, result) => {
      try {
        if (error) throw error;

        res
          .status(200)
          .send({
            message: `${headerId} is deleted successfully`,
          });
      } catch (err) {
        next(err);
      }
    }
  );
});

module.exports = router;
