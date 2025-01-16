const express = require("express");
const Joi = require("joi");
const pool = require("../../dbConnection");
const router = express.Router();

router.post("/call", async (req, res, next) => {
  const schema = Joi.object({
    pHierarchyId: Joi.number().required(),
    pTransactionId: Joi.number().required(),
    pTransactionNum: Joi.string().required(),
    pAppsUsername: Joi.string().required(),
    pNotificationId: Joi.number().required(),
    pApprovalType: Joi.string().required(),
    pEmpid: Joi.number().required(),
    pNote: Joi.string().required(),
    pAuthorizationStatus: Joi.string().required(),
    pCustGroupId: Joi.number().required(),
    pTrxType: Joi.string().required(),
  });

  const validation = schema.validate(req.body);

  if (validation.error) {
    console.log(validation.error);

    return res.status(400).send("Invalid inputs");
  }

  const {
    pHierarchyId,
    pTransactionId,
    pTransactionNum,
    pAppsUsername,
    pNotificationId,
    pApprovalType,
    pEmpid,
    pNote,
    pAuthorizationStatus,
    pCustGroupId,
    pTrxType,
  } = req.body;

  const date = new Date();

  await pool.query(
    "CALL proc_so_approval_all($1,$2,$3,$4,$5,$6,$7,$8,$9,$10,$11);",
    [
      pHierarchyId,
      pTransactionId,
      pTransactionNum,
      pAppsUsername,
      pNotificationId,
      pApprovalType,
      pEmpid,
      pNote,
      pAuthorizationStatus,
      pCustGroupId,
      pTrxType,
    ],
    (error, result) => {
      try {
        if (error) throw error;

        return res.status(200).json({ message: "Successfully updated!" });
      } catch (err) {
        next(err);
      }
    }
  );
});

router.get("/get-approval-seq/:header_id", async (req, res, next) => {
  const headerId = req.params.header_id;

  await pool.query(
    "SELECT * FROM public.approval_action_history_v WHERE object_id=$1 order by sl asc;",
    [headerId],
    (error, result) => {
      try {
        if (error) throw error;
        res.status(200).send(result.rows);
      } catch (err) {
        next(err);
      }
    }
  );
});

router.post("/submit-approval", async (req, res, next) => {
  const schema = Joi.object({
    pHierarchyId: Joi.number().required(),
    pTransactionID: Joi.number().required(),
    pTransactionNum: Joi.string().required(),
    pAppsUsername: Joi.string().required(),
    pNotificationID: Joi.number().required(),
    pApprovalType: Joi.string().required(),
    pEmpid: Joi.number().required(),
    pNote: Joi.string().required(),
    pCustGroupId: Joi.number().required(),
    pTrxType: Joi.string().required(),
  });

  const validation = schema.validate(req.body);

  if (validation.error) {
    console.log(validation.error);

    return res.status(400).send("Invalid inputs");
  }

  const {
    pHierarchyId,
    pTransactionID,
    pTransactionNum,
    pAppsUsername,
    pNotificationID,
    pApprovalType,
    pEmpid,
    pNote,
    pCustGroupId,
    pTrxType,
  } = req.body;

  const date = new Date();

  await pool.query(
    "CALL proc_so_approval_from_panel($1,$2,$3,$4,$5,$6,$7,$8,$9,$10);",
    [
      pHierarchyId,
      pTransactionID,
      pTransactionNum,
      pAppsUsername,
      pNotificationID,
      pApprovalType,
      pEmpid,
      pNote,
      pCustGroupId,
      pTrxType,
    ],
    (error, result) => {
      try {
        if (error) throw error;

        return res.status(200).json({ message: "Successfully updated!" });
      } catch (err) {
        next(err);
      }
    }
  );
});

module.exports = router;
