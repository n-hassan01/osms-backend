const express = require("express");
const pool = require("/Project Work/OSMS/osms-backend/dbConnection");
const router = express.Router();

router.post("/", async (req, res, next) => {
  const schema = validateForm.object({
    location_code: validateForm.string().min(60).required(), //for varchar
    business_group_id: validateForm.number().min(6).required(), //for numeric
    description: validateForm.string().min(240).required(),
    ship_to_location_id: validateForm.number().min(15).required(),
    inventory_organization_id: validateForm.number().min(15).required(),
    address_line_1: validateForm.string().min(240).required(),
    address_line_2: validateForm.string().min(240).required(),
    address_line_3: validateForm.string().min(240).required(),
    town_or_city: validateForm.string().min(30).required(),
    country: validateForm.string().min(60).required(),
    postal_code: validateForm.string().min(30).required(),
    telephone_number_1: validateForm.string().min(60).required(),
    telephone_number_2: validateForm.string().min(60).required(),
    telephone_number_3: validateForm.string().min(60).required(),
    last_updated_by: validateForm.number().min(15).required(),
    last_update_login: validateForm.number().min(15).required(),
    created_by: validateForm.number().min(15).required(),
  });
  const validation = schema.validate(req.body);
  if (validation.error) {
    console.log(validation.error);

    res.status(400).send("Invalid inputs");
    next();
  }

  try {
    const {
      location_code,
      business_group_id,
      description,
      ship_to_location_id,
      inventory_organization_id,
      inactive_date,
      address_line_1,
      address_line_2,
      address_line_3,
      town_or_city,
      country,
      postal_code,
      telephone_number_1,
      telephone_number_2,
      telephone_number_3,
      last_update_date,
      last_updated_by,
      last_update_login,
      created_by,
      creation_date,
    } = req.body;

    await pool.query(
      "INSERT INTO hr_locations_all (location_code,business_group_id,description,ship_to_location_id,inventory_organization_id,inactive_date,address_line_1,address_line_2,address_line_3,town_or_city,country,postal_code,telephone_number_1,telephone_number_2,telephone_number_3,last_update_date,last_updated_by,last_update_login,created_by,creation_date) VALUES ($1, $2,$3,$4,$5,$6,$7,$8,$9,$10,$11,$12,$13,$14,$15,$16,$17,$18,$19,$20)",
      [
        location_code,
        business_group_id,
        description,
        ship_to_location_id,
        inventory_organization_id,
        inactive_date,
        address_line_1,
        address_line_2,
        address_line_3,
        town_or_city,
        country,
        postal_code,
        telephone_number_1,
        telephone_number_2,
        telephone_number_3,
        last_update_date,
        last_updated_by,
        last_update_login,
        created_by,
        creation_date,
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
  } catch (error) {
    next(error);
  }
});

module.exports = router;
