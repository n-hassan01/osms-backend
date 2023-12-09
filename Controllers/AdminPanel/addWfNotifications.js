const Joi = require("joi");
const express = require("express");
const pool = require("../../dbConnection");
const router = express.Router();

router.post("/", async (req, res, next) => {
  console.log(req.body);
  const schema = Joi.object({
    groupId: Joi.number().required(),
    messageType: Joi.string().max(8).required(),
    messageName: Joi.string().max(30).required(),
    recipientRole: Joi.string().max(320).required(),
    status: Joi.string().max(8).required(),
    accessKey: Joi.string().max(80).required(),
    mailStatus: Joi.string().max(8),
    priority: Joi.number(),
    beginDate: Joi.string(),
    endDate: Joi.string(),
    dueDate: Joi.string(),
    responder: Joi.string().max(320),
    userComment: Joi.string().max(4000),
    callback: Joi.string().max(240),
    context: Joi.string().max(2000),
    originalRecipient: Joi.string().max(320).required(),
    fromUser: Joi.string().max(320),
    toUser: Joi.string().max(320),
    subject: Joi.string().max(2000),
    language: Joi.string().max(4),
    MoreInfoRole: Joi.string().max(4),
    fromRole: Joi.string().max(320),
    securityGroupId: Joi.string().max(32),
    userKey: Joi.string().max(240),
    itemKey: Joi.string().max(240),
    sentDate: Joi.string(),
    approvalPathId: Joi.number(),
  });

  const validation = schema.validate(req.body);

  if (validation.error) {
    console.log(validation.error.message);
    res.status(400).send("Invalid inputs");
  } else {
    const {
        groupId,
        messageType,
        messageName,
        recipientRole,
        status,
        accessKey,
        mailStatus,
        priority,
        beginDate,
        endDate,
        dueDate,
        responder,
        userComment,
        callback,
        context,
        originalRecipient,
        fromUser,
        toUser,
        subject,
        language,
        MoreInfoRole,
        fromRole,
        securityGroupId,
        userKey,
        itemKey,
        sentDate,
        approvalPathId,
    } = req.body;

    await pool.query(
      "INSERT INTO wf_notifications ( group_id ,message_type,message_name,recipient_role,status,access_key,mail_status,priority,begin_date,end_date ,due_date ,responder,user_comment,callback,context,original_recipient,from_user,to_user,subject,language, more_info_role,from_role,security_group_id,user_key ,item_key,sent_date,approval_path_id       ) VALUES ($1, $2,$3,$4,$5,$6,$7,$8,$9,$10,$11,$12,$13,$14,$15,$16,$17,$18,$19,$20,$21,$22,$23,$24,$25,$26,$27)",
      [
        groupId,
        messageType,
        messageName,
        recipientRole,
        status,
        accessKey,
        mailStatus,
        priority,
        beginDate,
        endDate,
        dueDate,
        responder,
        userComment,
        callback,
        context,
        originalRecipient,
        fromUser,
        toUser,
        subject,
        language,
        MoreInfoRole,
        fromRole,
        securityGroupId,
        userKey,
        itemKey,
        sentDate,
        approvalPathId,
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
