const express = require("express");
const pool = require("../../dbConnection");
const router = express.Router();
const Joi = require("joi");

router.put("/:user_id", async (req, res, next) => {
  const userId = req.params.user_id;

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
      "UPDATE fnd_user SET user_name = $1,last_update_date = $2,last_updated_by=$3,creation_date=$4,created_by=$5,last_update_login=$6,encrypted_foundation_password=$7,encrypted_user_password=$8,session_number=$9,start_date=$10,end_date=$11,description=$12,last_logon_date=$13,password_date=$14, password_accesses_left=$15,password_lifespan_accesses =$16,password_lifespan_days=$17,employee_id=$18,email_address=$19,user_password =$20 WHERE user_id =$21 ",
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
        userId
      ],
      (error, result) => {
        try {
          if (error) throw error;

          res.status(200).json(` modified with userId: ${userId}`);
        } catch (err) {
          next(err);
        }
      }
    );
  }
});

module.exports = router;
