const express = require("express");
const pool = require("../../dbConnection");
const router = express.Router();

router.get("/:employee_id", async (req, res, next) => {
    const employeeId = req.params.employee_id;
  await pool.query(
    "select public.FN_GET_EMP_ID('$1');",
    [employeeId],

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
