const express = require("express");
const pool = require("../../dbConnection");
const Joi = require("joi");
const loginTokenMiddleware = require("../../middlewares/getLoginTokenMiddleware");
const router = express.Router();

router.put("/:person_id", async (req, res, next) => {

  const personId = req.params.person_id;
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
      "UPDATE per_all_peoples SET effective_start_date = $2,effective_end_date=$3,business_group_id=$4,person_type_id=$5,employee_number=$6,title=$7,full_name=$8,first_name=$9,middle_names=$10,last_name=$11,blood_type=$12,date_of_birth=$13,email_address=$14,marital_status=$15,nationality=$16,sex=$17,work_telephone=$18,last_update_date=$19,last_updated_by=$20,last_update_login=$21,creation_date=$22,date_of_death =$23,original_date_of_hire=$24,town_of_birth=$25,region_of_birth=$26,country_of_birth=$27,global_person_id=$28,party_id=$29,created_by=$30 WHERE person_id =$1 ",
      [
        personId,
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
        creationDate,
        dateOfDeath,
        originalDateOfHire,
        townOfBirth,
        regionOfBirth,
        countryOfBirth,
        globalPersonId,
        partyId,
        createdBy,
      ],
      (error, result) => {
        try {
          if (error) throw error;

          res
            .status(200)
            .json({
              message: `Successfully updated! ${personId}`, 
              headerInfo: result.rows,
            }
            );
        } catch (err) {
          next(err);
        }
      }
    );
  }
});

module.exports = router;
