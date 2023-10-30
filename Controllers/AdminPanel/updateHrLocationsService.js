const express = require("express");
const pool = require("/Project Work/OSMS/osms-backend/dbConnection");
const router = express.Router();

router.put("/:location_id", async (req, res, next) => {
  const locationId = req.params.location_id;
  const {
    locationCode,
    businessGroupId,
    description,
    shipToLocationId,
    inventoryOrganizationId,
    inactiveDate,
    addressLine1,
    addressLine2,
    addressLine3,
    townOrCity,
    country,
    postalCode,
    telephoneNumber1,
    telephoneNumber2,
    telephoneNumber3,
    lastUpdateDate,
    lastUpdatedBy,
    lastUpdateLogin,
    createdBy,
    creationDate,
  } = req.body;

  await pool.query(
    "UPDATE hr_locations_all SET location_code = $1,business_group_id = $2,description=$3,ship_to_location_id=$4,inventory_organization_id=$5,inactive_date=$6,address_line_1=$7,address_line_2=$8,address_line_3=$9,town_or_city=$10,country=$11,postal_code=$12,telephone_number_1=$13,telephone_number_2=$14,telephone_number_3=$15,last_update_date=$16,last_updated_by=$17,last_update_login=$18,created_by=$19,creation_date=$20 WHERE location_id =$21 ",
    [
      locationCode,
      businessGroupId,
      description,
      shipToLocationId,
      inventoryOrganizationId,
      inactiveDate,
      addressLine1,
      addressLine2,
      addressLine3,
      townOrCity,
      country,
      postalCode,
      telephoneNumber1,
      telephoneNumber2,
      telephoneNumber3,
      lastUpdateDate,
      lastUpdatedBy,
      lastUpdateLogin,
      createdBy,
      creationDate,
      locationId,
    ],
    (error, result) => {
      try {
        if (error) throw error;

        res
          .status(200)
          .json(`Location modified with Location_Id: ${locationId}`);
      } catch (err) {
        next(err);
      }
    }
  );
});

module.exports = router;
