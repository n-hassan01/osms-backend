const Joi = require("joi");
const express = require("express");
const bcrypt = require("bcrypt");
const pool = require("../dbConnection");

const router = express.Router();

router.post("/", async (req, res, next) => {
  try {
    // Validation schema
    const schema = Joi.object({
      id: Joi.string().required(),
      password: Joi.string().min(6).required(),
    });

    // Validate request body
    const validation = schema.validate(req.body);

    if (validation.error) {
      return res.status(400).send("Invalid inputs");
    }

    // Hash the password
    const hashedPassword = await bcrypt.hash(req.body.password, 10);

    // Check if the employee exists in the database
    const employeeResult = await pool.query(
      "SELECT * FROM per_all_peoples WHERE employee_number=$1",
      [req.body.id]
    );

    // Check if the business partner exists in the database
    const customerResult = await pool.query(
      "SELECT * FROM hz_cust_accounts WHERE account_number=$1",
      [req.body.id]
    );

    if (employeeResult.rowCount === 0 && customerResult.rowCount === 0) {
      // if (customerResult.rowCount === 0) {
      //   return res.status(401).send({ message: "Unauthorized!" });
      // }
      return res.status(401).send({ message: "Unauthorized!" });
    }

    const result = employeeResult.rows[0]
      ? employeeResult.rows[0]
      : customerResult.rows[0];
    const {
      employee_number,
      email_address,
      work_telephone,
      account_number,
      cust_account_id,
      person_id,
    } = result;

    const userName = employee_number ? employee_number : account_number;

    // Check if the user already exists in the "fnd_user" table
    const userResult = await pool.query(
      'SELECT * FROM "fnd_user" WHERE user_name=$1',
      [userName]
    );

    if (userResult.rowCount > 0 && userResult.rows[0].status === "approved") {
      return res.status(400).send({ message: "User already exists!" });
    }

    // Check if the user is pending verification by an admin
    if (userResult.rowCount > 0 && userResult.rows[0].status === "pending") {
      return res.status(400).send({
        message: "Signup is pending. check email or contact admin!",
      });
    }

    // Determine the authentication method
    let authenticationMethod;
    if (email_address) {
      authenticationMethod = {
        flag: "email",
        value: email_address,
      };
    } else {
      // Insert a new user into the "fnd_user" table
      const newUser = {
        id: req.body.id,
        password: hashedPassword,
      };

      const currentDate = new Date().toJSON();
      const userId = person_id ? person_id : cust_account_id;

      await pool.query(
        'INSERT INTO "fnd_user"(user_name, user_password, start_date, employee_id, status) VALUES($1, $2, $3, $4) RETURNING *',
        [newUser.id, newUser.password, currentDate, userId, "pending"]
      );

      authenticationMethod = {
        flag: "phone",
        value: work_telephone,
      };
    }

    // Success response
    res.status(200).send({
      message: "Sign up complete!",
      authenticationMethod,
      user: req.body.id,
    });
  } catch (error) {
    // Error handling
    next(error);
  }
});

module.exports = router;
