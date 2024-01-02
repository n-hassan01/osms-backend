const Joi = require("joi");
const express = require("express");
const pool = require("../../dbConnection");
const router = express.Router();

router.post("/", async (req, res, next) => {
  try {
    const {
      userType,
      userName,
      userPassword,
      custName,
      custNid,
      custAddress,
      custAge,
      custGender,
      custProfession,
      custOrganization,
    } = req.body;

    const result = await pool.query(
      "CALL proc_populate_user_signup_process($1,$2,$3,$4,$5,$6,$7,$8,$9,$10)",
      [
        userType,
        userName,
        userPassword,
        custName,
        custNid,
        custAddress,
        custAge,
        custGender,
        custProfession,
        custOrganization,
      ]
    );

    res.json(result.rows[0]);
  } catch (error) {
    console.error(error);
    next(error);
  }
});

module.exports = router;
