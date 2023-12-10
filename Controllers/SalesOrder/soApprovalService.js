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
  });

  const validation = schema.validate(req.body);

  if (validation.error) {
    console.log(validation.error);

    return res.status(400).send("Invalid inputs");
  }

  const { pHierarchyId, pTransactionId, pTransactionNum, pAppsUsername } =
    req.body;

  const date = new Date();

  await pool.query(
    "CALL proc_so_approval($1,$2,$3,$4);",
    [pHierarchyId, pTransactionId, pTransactionNum, pAppsUsername],
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
