const Joi = require("joi");
const express = require("express");
const bcrypt = require("bcrypt");
const pool = require("../dbConnection");

const router = express.Router();

router.post("/", async (req, res, next) => {
  try {
    // Validation schema
    const schema = Joi.object({
      userName: Joi.string().required(),
      password: Joi.string().min(6).required(),
      userType: Joi.string().required(),
      name: Joi.string().min(0),
      nid: Joi.string().min(0),
      age: Joi.number().allow(null),
      gender: Joi.string().min(0),
      profession: Joi.string().min(0),
      orgaization: Joi.string().min(0),
      address: Joi.string().min(0),
    });

    // Validate request body
    const validation = schema.validate(req.body);

    if (validation.error) {
      return res.status(400).send("Invalid inputs");
    }

    const {
      userName,
      password,
      userType,
      name,
      nid,
      age,
      gender,
      profession,
      orgaization,
      address,
    } = req.body;

    // Hash the password
    const hashedPassword = await bcrypt.hash(password, 10);

    const currentDate = new Date().toJSON();

    if (userType === "Private") {
      // Check if the employee exists in the database
      const employeeResult = await pool.query(
        "SELECT * FROM per_all_peoples WHERE employee_number=$1",
        [userName]
      );

      // Check if the business partner exists in the database
      const customerResult = await pool.query(
        "SELECT * FROM hz_cust_accounts WHERE account_number=$1",
        [userName]
      );

      if (employeeResult.rowCount === 0 && customerResult.rowCount === 0) {
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

      const userCode = employee_number ? employee_number : account_number;

      // Check if the user already exists in the "fnd_user" table
      const userResult = await pool.query(
        'SELECT * FROM "fnd_user" WHERE user_name=$1',
        [userCode]
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
          id: userName,
          password: hashedPassword,
        };

        const userId = person_id ? person_id : cust_account_id;
        const subCatagory = person_id ? "Employee" : "Business partner";

        await pool.query(
          'INSERT INTO "fnd_user"(user_name, user_password, start_date, employee_id, status, user_category, user_sub_category) VALUES($1, $2, $3, $4, $5, $6, $7) RETURNING *',
          [
            newUser.id,
            newUser.password,
            currentDate,
            userId,
            "pending",
            "Private",
            subCatagory,
          ]
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
        user: userName,
      });
    } else {
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

      await pool.query(
        'INSERT INTO "fnd_user"(user_name, user_password, start_date, status, user_category, user_sub_category) VALUES($1, $2, $3, $4, $5, $6) RETURNING *',
        [userName, hashedPassword, currentDate, "pending", "Public", "Public"]
      );

      const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
      const isEmail = emailRegex.test(userName);

      const authenticationMethod = isEmail
        ? {
            flag: "email",
            value: userName,
          }
        : {
            flag: "phone",
            value: userName,
          };

      return res.status(200).json({
        message: "Sign up complete!",
        authenticationMethod,
        user: userName,
      });
    }
  } catch (error) {
    // Error handling
    next(error);
  }
});

module.exports = router;
