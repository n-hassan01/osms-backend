const express = require("express");
const pool = require("../../dbConnection");
const router = express.Router();

router.put("/:object_id", async (req, res, next) => {
  const objectId = req.params.object_id;
  

  await pool.query(
    "DELETE FROM po_action_history WHERE object_id = $1",
    [objectId],
    (error, result) => {
      try {
        if (error) throw error;

        res
          .status(200)
          .json(` Deleted with Id: ${objectId}`);
      } catch (err) {
        next(err);
      }
    }
  );
});

module.exports = router;
