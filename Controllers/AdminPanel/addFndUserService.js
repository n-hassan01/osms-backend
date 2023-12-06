const Joi = require("joi");
const express = require("express");
const pool = require("../../dbConnection");
const router = express.Router();

router.post("/", async (req, res, next) => {
  console.log(req.body);
  const schema = Joi.object({
    userName: Joi.string().max(100).required(),
    lastUpdateDate: Joi.string(),
    lastUpdatedBy: Joi.number(),
    creationDate: Joi.string(),
    createdBy: Joi.number(),
    lastUpdateLogin: Joi.number().min(0),
    encryptedFoundationPassword: Joi.string().max(100),
    encryptedUserPassword: Joi.string().max(100),
    sessionNumber: Joi.number(),
    startDate: Joi.string().required(),
    endDate: Joi.string().min(0).required(),
    description: Joi.string().max(240).required(),
    lastLogonDate: Joi.string().min(0),
    passwordDate: Joi.string().min(0),
    passwordAccessesLeft: Joi.number().min(0),
    passwordLifespanAccesses: Joi.number().min(0),
    passwordLifespanDays: Joi.number().min(0),
    employeeId: Joi.number().required(),
    emailAddress: Joi.string().max(240),
    userPassword: Joi.string().max(240).required(),
  });

  const validation = schema.validate(req.body);

  if (validation.error) {
    console.log(validation.error.message);
    res.status(400).send("Invalid inputs");
  } else {
    const {
        userName,
        lastUpdateDate,
        lastUpdatedBy,
        creationDate,
        createdBy,
        lastUpdateLogin,
        encryptedFoundationPassword,
        encryptedUserPassword,
        sessionNumber,
        startDate,
        endDate,
        description,
        lastLogonDate,
        passwordDate,
        passwordAccessesLeft,
        passwordLifespanAccesses,
        passwordLifespanDays,
        employeeId,
        emailAddress,
        userPassword,
    } = req.body;

    await pool.query(
      "INSERT INTO fnd_user ( user_name ,last_update_date,last_updated_by,creation_date,created_by,last_update_login,encrypted_foundation_password,encrypted_user_password,session_number,start_date,end_date ,description,last_logon_date,password_date,password_accesses_left,password_lifespan_accesses,password_lifespan_days,employee_id,email_address,user_password        ) VALUES ($1, $2,$3,$4,$5,$6,$7,$8,$9,$10,$11,$12,$13,$14,$15,$16,$17,$18,$19,$20)",
      [
        userName,
        lastUpdateDate,
        lastUpdatedBy,
        creationDate,
        createdBy,
        lastUpdateLogin,
        encryptedFoundationPassword,
        encryptedUserPassword,
        sessionNumber,
        startDate,
        endDate,
        description,
        lastLogonDate,
        passwordDate,
        passwordAccessesLeft,
        passwordLifespanAccesses,
        passwordLifespanDays,
        employeeId,
        emailAddress,
        userPassword,
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
