const express = require("express");
const pool = require("../dbConnection");

const router = express.Router();

router.get("/", async (req, res, next) => {
  const id = req.id;

  await pool.query(
    "select * from per_all_peoples where employee_number = $1",
    [id],
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
