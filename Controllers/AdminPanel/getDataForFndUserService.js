const express = require("express");
const pool = require("../../dbConnection");
const router = express.Router();

router.get("/:person_id", async (req, res, next) => {
    const personId = req.params.person_id;
  await pool.query(
    "SELECT person_id,employee_number FROM per_all_peoples where person_id= $1",
    [personId],

    (error, result) => {
      try {
        if (error) throw error;

        res.status(200).json(result.rows);
      } catch (err) {
        next(err);
      }
    }
  );
});

module.exports = router;
