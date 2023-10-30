const express = require("express");
const pool = require("/Project Work/OSMS/osms-backend/dbConnection");
const router = express.Router();

router.get("/", async (req, res, next) => {
  await pool.query(
    "SELECT * FROM hr_locations_all ",

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
