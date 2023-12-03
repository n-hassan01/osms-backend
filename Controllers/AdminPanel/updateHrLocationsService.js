const express = require("express");
const pool = require("../../dbConnection");
const router = express.Router();

router.put("/:location_id", async (req, res, next) => {
  const locationId = req.params.location_id;
  const {
    locationCode,
    businessGroupId,
    description,
    shipToLocationId,
    inventoryOrganizationId,
    
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
    "UPDATE hr_locations_all SET location_code = $1,business_group_id = $2,description=$3,ship_to_location_id=$4,inventory_organization_id=$5,address_line_1=$6,address_line_2=$7,address_line_3=$8,town_or_city=$9,country=$10,postal_code=$11,telephone_number_1=$12,telephone_number_2=$13,telephone_number_3=$14,last_update_date=$15,last_updated_by=$16,last_update_login=$17,created_by=$18,creation_date=$19 WHERE location_id =$20 ",
    [
      locationCode,
      businessGroupId,
      description,
      shipToLocationId,
      inventoryOrganizationId,
      
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
