const express = require("express");
const pool = require("../../dbConnection");
const router = express.Router();

router.post("/", async (req, res, next) => {
  const { regionId, areaId } = req.body;
  try {
    await pool.query(
      "SELECT * FROM territory WHERE region_id = $1 and area_id=$2",
      [regionId, areaId],
      (error, result) => {
        try {
          if (error) throw error;

          res.status(200).json(result.rows);
        } catch (err) {
          next(err);
        }
      }
    );
  } catch (err) {
    next(err);
  }
});

module.exports = router;
