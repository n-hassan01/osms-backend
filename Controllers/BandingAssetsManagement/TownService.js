const express = require("express");
const pool = require("../../dbConnection");
const router = express.Router();

router.post("/", async (req, res, next) => {
  const { regionId, areaId, territoryId } = req.body;

  await pool.query(
    "SELECT town_id, town_code, town_name FROM public.town WHERE region_id=$1 AND area_id=$2 AND territory_id=$3;",
    [regionId, areaId, territoryId],
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
