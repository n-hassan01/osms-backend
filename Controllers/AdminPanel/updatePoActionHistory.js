const express = require("express");
const pool = require("../../dbConnection");
const Joi = require("joi");
const router = express.Router();

router.put("/:object_id", async (req, res, next) => {
  const objectId = req.params.object_id;
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
      "UPDATE po_action_history SET object_type_code = $1,object_sub_type_code = $2,sequence_num=$3,last_update_date=$4,last_updated_by=$5,creation_date=$6,created_by=$7,action_code=$8,action_date=$9,employee_id=$10,approval_path_id=$11,note=$12,object_revision_num=$13,offline_code=$14,last_update_login=$15,request_id=$16,program_application_id=$17,program_id=$18,program_update_date=$19,program_date=$20,approval_group_id=$21 WHERE object_id  =$22 ",
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
        objectId
      ],
      (error, result) => {
        try {
          if (error) throw error;

          res
            .status(200)
            .json(
              ` modified with Id: ${objectId}`
            );
        } catch (err) {
          next(err);
        }
      }
    );
  }
});

module.exports = router;
