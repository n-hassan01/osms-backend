const Joi = require("joi");
const express = require("express");
const pool = require("../../dbConnection");
const bcrypt = require("bcrypt");
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

    const hashedPassword = await bcrypt.hash(userPassword, 10);

    const result = await pool.query(
      "CALL proc_populate_user_signup_process($1,$2,$3,$4,$5,$6,$7,$8,$9,$10)",
      [
        userType,
        userName,
        hashedPassword,
        custName,
        custNid,
        custAddress,
        custAge,
        custGender,
        custProfession,
        custOrganization,
      ]
    );

    res.json({ message: "Signup Completed!" });
  } catch (error) {
    console.error(error);
    next(error);
  }
});

module.exports = router;
