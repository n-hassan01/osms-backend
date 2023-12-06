const express = require("express");
const pool = require("../../dbConnection");
const router = express.Router();

router.delete("/:person_id", async (req, res, next) => {
  const personId = req.params.person_id;

  await pool.query(
    "DELETE FROM per_all_peoples WHERE person_id = $1",
    [personId],
    (error, result) => {
      try {
        if (error) throw error;

        res.status(200).json(` Deleted with personId: ${personId}`);
      } catch (err) {
        next(err);
      }
    }
  );
});

module.exports = router;
