const express = require("express");
const pool = require("/Project Work/OSMS/osms-backend/dbConnection");
const router = express.Router();

router.put("/:location_id", async (req, res, next) => {
  const locationId = req.params.location_id;
  const now = new Date();

  await pool.query(
    "UPDATE hr_locations_all SET inactive_date = $1 where location_id=$2",
    [now, locationId],
    (error, result) => {
      try {
        if (error) throw error;

        res
          .status(200)
          .json({ message: "Successfully Update last update login" });
      } catch (err) {
        next(err);
      }
    }
  );
});

module.exports = router;
