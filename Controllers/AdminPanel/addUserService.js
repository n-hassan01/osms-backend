const Joi = require("joi");
const express = require("express");
const pool = require("../../dbConnection");
const router = express.Router();
const bcrypt = require("bcrypt");

router.post("/", async (req, res, next) => {
  const {
    customerGroupId,
    email,
    employeeCode,
    employeeName,
    password,
    supervisorId,
  } = req.body;

  const hashedPassword = await bcrypt.hash(password, 10);

  await pool.query(
    "CALL public.proc_create_new_user_process ($1, $2, $3, $4, $5, $6)",
    [
      employeeCode,
      employeeName,
      hashedPassword,
      email,
      supervisorId,
      customerGroupId,
    ],
    (error, result) => {
      try {
        if (error) throw error;

        res.status(200).json(result.rows);
      } catch (err) {
        next(err);
      }
    }
  );
});

module.exports = router;
