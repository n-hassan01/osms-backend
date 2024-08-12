const express = require("express");
const pool = require("../../dbConnection");
const router = express.Router();

router.post("/", async (req, res, next) => {
  const { regionId, areaId, territoryId, townId } = req.body;

  await pool.query(
    "SELECT beat_id, beat_code, beat_name FROM public.beat WHERE region_id=$1 AND area_id=$2 AND territory_id=$3 AND town_id=$4;",
    [regionId, areaId, territoryId, townId],
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
