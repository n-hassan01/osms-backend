const Joi = require("joi");
const express = require("express");
const pool = require("../../dbConnection");
const router = express.Router();

router.post("/", async (req, res, next) => {
  const schema = Joi.object({
    
    locationCode: Joi.string().max(60),
    businessGroupId: Joi.number().max(6),
    description: Joi.string().max(240),
    shipToLocationId: Joi.number().max(15),
    inventoryOrganizationId: Joi.number().max(15),
    inactiveDate: Joi.string().min(0),
    addressLine1: Joi.string().max(240),
    addressLine2: Joi.string().max(240),
    addressLine3: Joi.string().max(240),
    townOrCity: Joi.string().max(30),
    country: Joi.string().max(60),
    postalCode: Joi.string().max(30),
    telephoneNumber1: Joi.string().max(60),
    telephoneNumber2: Joi.string().max(60),
    telephoneNumber3: Joi.string().max(60),
    lastUpdateDate: Joi.string().min(0),
    lastUpdatedBy: Joi.number().max(15),
    lastUpdateLogin: Joi.number().max(15),
    createdBy: Joi.number().max(15),
    creationDate: Joi.string().min(0),
  });
  const validation = schema.validate(req.body);
  if (validation.error) {
    res.status(400).send("Invalid inputs");
  } else {
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
      "INSERT INTO hr_locations_all (location_code,business_group_id,description,ship_to_location_id,inventory_organization_id,inactive_date,address_line_1,address_line_2,address_line_3,town_or_city,country,postal_code,telephone_number_1,telephone_number_2,telephone_number_3,last_update_date,last_updated_by,last_update_login,created_by,creation_date) VALUES ($1, $2,$3,$4,$5,$6,$7,$8,$9,$10,$11,$12,$13,$14,$15,$16,$17,$18,$19,$20)",
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
      ],
      (error, result) => {
        try {
          if (error) throw error;

          res.status(200).json({ message: "Successfully completed adding" });
        } catch (err) {
          next(err);
        }
      }
    );
  }
});

module.exports = router;
