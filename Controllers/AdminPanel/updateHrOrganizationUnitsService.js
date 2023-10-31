const express = require("express");
const pool = require("../../dbConnection");
const router = express.Router();

router.put("/:organization_id", async (req, res, next) => {
  const organizationId = req.params.organization_id;
  const {
    businessGroupId,
    locationId,
    dateForm,
    name,
    dateTo,
    lastUpdateDate,
    lastUpdatedBy,
    lastUpdateLogin,
    createdBy,
    creationDate,
  } = req.body;

  await pool.query(
    "UPDATE hr_all_organization_units SET business_group_id = $1,location_id = $2,date_from=$3,name=$4,date_to=$5,last_update_date=$6,last_updated_by=$7,last_update_login=$8,created_by=$9,creation_date=$10 WHERE organization_id =$11 ",
    [
      businessGroupId,
      locationId,
      dateForm,
      name,
      dateTo,
      lastUpdateDate,
      lastUpdatedBy,
      lastUpdateLogin,
      createdBy,
      creationDate,
      organizationId,
    ],
    (error, result) => {
      try {
        if (error) throw error;

        res
          .status(200)
          .json(
            `Organization modified with Organization_Id: ${organizationId}`
          );
      } catch (err) {
        next(err);
      }
    }
  );
});

module.exports = router;
