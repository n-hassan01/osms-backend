const express = require("express");
const pool = require("../../dbConnection");
const Joi = require("joi");
const router = express.Router();

router.put("/:notification_id", async (req, res, next) => {
  const notificationId = req.params.notification_id;
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
      "UPDATE wf_notifications SET group_id = $1,message_type = $2,message_name=$3,recipient_role=$4,status=$5,access_key=$6,mail_status=$7,priority=$8,begin_date=$9,end_date=$10,due_date=$11,responder=$12,user_comment=$13,callback=$14,context=$15,original_recipient=$16,from_user=$17,to_user=$18,subject=$19,language=$20,more_info_role=$21,from_role=$22,security_group_id=$23,user_key=$24,item_key=$25,sent_date=$26,approval_path_id=$27 WHERE notification_id  =$28 ",
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
        notificationId
      ],
      (error, result) => {
        try {
          if (error) throw error;

          res
            .status(200)
            .json(
              ` modified with Id: ${notificationId}`
            );
        } catch (err) {
          next(err);
        }
      }
    );
  }
});

module.exports = router;
