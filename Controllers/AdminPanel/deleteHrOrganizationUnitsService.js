const express = require("express");
const pool = require("../../dbConnection");
const router = express.Router();

router.delete("/:organization_id", async (req, res, next) => {
  const organizationId = req.params.organization_id;
  //const now = new Date();

  await pool.query(
    "DELETE FROM hr_all_organization_units WHERE organization_id = $1",
    [organizationId],
    (error, result) => {
      try {
        if (error) throw error;

        res
          .status(200)
          .json(`Organization Deleted with Organization_Id: ${organizationId}`);
      } catch (err) {
        next(err);
      }
    }
  );
});

module.exports = router;
