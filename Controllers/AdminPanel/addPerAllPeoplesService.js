const Joi = require("joi");
const express = require("express");
const pool = require("../../dbConnection");
const router = express.Router();

router.post("/", async (req, res, next) => {
  console.log(req.body);
  const schema = Joi.object({
    effectiveStartDate: Joi.string().required(),
    effectiveEndDate: Joi.string().required(),
    businessGroupId: Joi.number().required(),
    personTypeId: Joi.number(),
    employeeNumber: Joi.string().max(30).required(),
    title: Joi.string().max(30),
    fullName: Joi.string().max(240).required(),
    firstName: Joi.string().max(150),
    middleNames: Joi.string().max(60),
    lastName: Joi.string().max(150),
    bloodType: Joi.string().max(30),
    dateOfBirth: Joi.string().min(0),
    emailAddress: Joi.string().max(240).required(),
    maritalStatus: Joi.string().max(30),
    nationality: Joi.string().max(30),
    sex: Joi.string().max(30),
    workTelephone: Joi.string().max(60).required(),
    lastUpdateDate: Joi.string().min(0),
    lastUpdatedBy: Joi.number().min(0),
    lastUpdateLogin: Joi.number().min(0),
    createdBy: Joi.number().min(0),
    creationDate: Joi.string().min(0),
    dateOfDeath: Joi.string().min(0),
    originalDateOfHire: Joi.string().min(0).required(),
    townOfBirth: Joi.string().max(90),
    regionOfBirth: Joi.string().max(90),
    countryOfBirth: Joi.string().max(90),
    globalPersonId: Joi.string().max(30),
    partyId: Joi.number().min(0),
  });

  const validation = schema.validate(req.body);

  if (validation.error) {
    console.log(validation.error.message);
    res.status(400).send("Invalid inputs");
  } else {
    const {
      effectiveStartDate,
      effectiveEndDate,
      businessGroupId,
      personTypeId,
      employeeNumber,
      title,
      fullName,
      firstName,
      middleNames,
      lastName,
      bloodType,
      dateOfBirth,
      emailAddress,
      maritalStatus,
      nationality,
      sex,
      workTelephone,
      lastUpdateDate,
      lastUpdatedBy,
      lastUpdateLogin,
      createdBy,
      creationDate,
      dateOfDeath,
      originalDateOfHire,
      townOfBirth,
      regionOfBirth,
      countryOfBirth,
      globalPersonId,
      partyId,
    } = req.body;

    await pool.query(
      "INSERT INTO per_all_peoples ( effective_start_date ,effective_end_date,business_group_id,person_type_id,employee_number,title,full_name,first_name,middle_names,last_name,blood_type,date_of_birth,email_address,marital_status,nationality,sex,work_telephone,last_update_date,last_updated_by,last_update_login,created_by,creation_date,date_of_death  ,original_date_of_hire,town_of_birth ,region_of_birth ,country_of_birth,global_person_id, party_id        ) VALUES ($1, $2,$3,$4,$5,$6,$7,$8,$9,$10,$11,$12,$13,$14,$15,$16,$17,$18,$19,$20,$21,$22,$23,$24,$25,$26,$27,$28,$29)",
      [
        effectiveStartDate,
        effectiveEndDate,
        businessGroupId,
        personTypeId,
        employeeNumber,
        title,
        fullName,
        firstName,
        middleNames,
        lastName,
        bloodType,
        dateOfBirth,
        emailAddress,
        maritalStatus,
        nationality,
        sex,
        workTelephone,
        lastUpdateDate,
        lastUpdatedBy,
        lastUpdateLogin,
        createdBy,
        creationDate,
        dateOfDeath,
        originalDateOfHire,
        townOfBirth,
        regionOfBirth,
        countryOfBirth,
        globalPersonId,
        partyId,
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
