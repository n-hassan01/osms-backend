const express = require("express");
const pool = require("../../dbConnection");
const router = express.Router();

router.get("/:location_id", async (req, res, next) => {
    const locationId = req.params.location_id;
  await pool.query(
    "SELECT * FROM hr_locations_all where location_id= $1",
    [locationId],

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
