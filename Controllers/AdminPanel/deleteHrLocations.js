const express = require("express");
const pool = require("/Project Work/OSMS/osms-backend/dbConnection");
const router = express.Router();

router.delete("/:location_id", async (req, res, next) => {
  const locationId = req.params.location_id;
  await pool.query(
    "DELETE FROM hr_locations_all WHERE location_id = $1",
    [locationId],
    (error, result) => {
      try {
        if (error) throw error;

        res.status(200).json({ message: "Successfully Deleted" });
      } catch (err) {
        next(err);
      }
    }
  );
});

module.exports = router;
