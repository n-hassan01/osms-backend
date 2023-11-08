const Joi = require("joi");
const express = require("express");
const pool = require("../../dbConnection");
const router = express.Router();

router.post("/", async (req, res, next) => {
  const schema = Joi.object({
    organizationId: Joi.number().max(15).required(),
    businessGroupId: Joi.number().max(15).required(),
    locationId: Joi.number().max(15),
    dateFrom: Joi.string().max(240).required(),
    name: Joi.string().max(240).required(),
    dateTo: Joi.string().min(0),
    lastUpdateDate: Joi.string().min(0),
    lastUpdatedBy: Joi.number().max(15),
    lastUpdateLogin: Joi.number().max(15),
    createdBy: Joi.number().max(15),
    creationDate: Joi.string().min(0),
  });
  const validation = schema.validate(req.body);
  if (validation.error) {
    console.log(validation.error.message);
    res.status(400).send("Invalid inputs");
  } else {
    const {
      organizationId,
      businessGroupId,
      locationId,
      dateFrom,
      name,
      dateTo,
      lastUpdateDate,
      lastUpdatedBy,
      lastUpdateLogin,
      createdBy,
      creationDate,
    } = req.body;

    await pool.query(
      "INSERT INTO hr_all_organization_units (organization_id,business_group_id,location_id,date_from,name,date_to,last_update_date,last_updated_by,last_update_login,created_by,creation_date) VALUES ($1, $2,$3,$4,$5,$6,$7,$8,$9,$10,$11)",
      [
        organizationId,
        businessGroupId,
        locationId,
        dateFrom,
        name,
        dateTo,
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
