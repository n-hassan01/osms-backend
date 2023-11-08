const express = require("express");
const pool = require("../../dbConnection");
const router = express.Router();

router.get("/:organization_id", async (req, res, next) => {
    const organizationId = req.params.organization_id;
  await pool.query(
    "SELECT * FROM hr_all_organization_units where organization_id= $1",
    [organizationId],

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
