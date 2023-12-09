const Joi = require("joi");
const express = require("express");
const pool = require("../../dbConnection");
const router = express.Router();

router.post("/", async (req, res, next) => {
  console.log(req.body);
  const schema = Joi.object({
    objectTypeCode: Joi.string().max(25).required(),
    objectSubTypeCode: Joi.string().max(25).required(),
    sequenceNum: Joi.number().required(),
    lastUpdateDate: Joi.string().required(),
    lastUpdatedBy: Joi.number().required(),
    creationDate: Joi.string().required(),
    createdBy: Joi.number().required(),
    actionCode: Joi.string().max(25),
    actionDate: Joi.string(),
    employeeId: Joi.number(),
    approvalPathId: Joi.number(),
    note: Joi.string().max(4000),
    objectRevisionNum: Joi.number(),
    offlineCode: Joi.string().max(25),
    lastUpdateLogin: Joi.number(),
    requestId: Joi.number(),
    programApplicationId: Joi.number(),
    programId: Joi.number(),
    programUpdateDate: Joi.string(),
    programDate: Joi.string(),
    approvalGroupId: Joi.number(),
  });

  const validation = schema.validate(req.body);

  if (validation.error) {
    console.log(validation.error.message);
    res.status(400).send("Invalid inputs");
  } else {
    const {
        objectTypeCode,
        objectSubTypeCode,
        sequenceNum,
        lastUpdateDate,
        lastUpdatedBy,
        creationDate,
        createdBy,
        actionCode,
        actionDate ,
        employeeId,
        approvalPathId,
        note,
        objectRevisionNum,
        offlineCode,
        lastUpdateLogin,
        requestId,
        programApplicationId,
        programId,
        programUpdateDate,
        programDate,
        approvalGroupId,
    } = req.body;

    await pool.query(
      "INSERT INTO po_action_history ( object_type_code ,object_sub_type_code,sequence_num,last_update_date,last_updated_by,creation_date,created_by,action_code,action_date,employee_id,approval_path_id ,note,object_revision_num,offline_code,last_update_login,request_id,program_application_id,program_id,program_update_date,program_date,approval_group_id        ) VALUES ($1, $2,$3,$4,$5,$6,$7,$8,$9,$10,$11,$12,$13,$14,$15,$16,$17,$18,$19,$20,$21)",
      [
        objectTypeCode,
        objectSubTypeCode,
        sequenceNum,
        lastUpdateDate,
        lastUpdatedBy,
        creationDate,
        createdBy,
        actionCode,
        actionDate ,
        employeeId,
        approvalPathId,
        note,
        objectRevisionNum,
        offlineCode,
        lastUpdateLogin,
        requestId,
        programApplicationId,
        programId,
        programUpdateDate,
        programDate,
        approvalGroupId,
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
