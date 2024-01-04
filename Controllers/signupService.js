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

      const type = employeeResult.rowCount > 0 ? "EMPLOYEE" : "CUSTOMER";

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
        // const newUser = {
        //   id: userName,
        //   password: hashedPassword,
        // };

        // const userId = person_id ? person_id : cust_account_id;
        // const subCatagory = person_id ? "Employee" : "Business Partner";

        // const fndId = await pool.query(
        //   'INSERT INTO "fnd_user"(user_name, user_password, start_date, employee_id, status, user_category, user_sub_category) VALUES($1, $2, $3, $4, $5, $6, $7) RETURNING user_id',
        //   [
        //     newUser.id,
        //     newUser.password,
        //     currentDate,
        //     userId,
        //     "pending",
        //     "Private",
        //     subCatagory,
        //   ]
        // );

        // console.log('id', fndId);
        // await pool.query(
        //   "INSERT INTO co_seller_users (user_id,hierarchy_id,hierarchy_line_id,hierarchy_line_num) VALUES ($1,$2,$3,$4)",
        //   [fndId, 1, 0, 0]
        // );

        // if (customerResult.rowCount === 0) {
        //   await pool.query(
        //     'INSERT INTO "hz_cust_accounts"(account_number, user_category, full_name, ship_to_address, last_update_date, last_updated_by, creation_date, created_by) VALUES($1, $2, $3, $4, $5, $6, $7, $8) RETURNING *',
        //     [
        //       employeeResult.rows[0].employee_number,
        //       "Private",
        //       employeeResult.rows[0].full_name,

        //       employeeResult.rows[0].ship_to_address,
        //       currentDate,
        //       1,
        //       currentDate,
        //       1,
        //     ]
        //   );
        // }

        // const fndResult = await pool.query(
        //   "SELECT user_id, user_name FROM fnd_user WHERE user_name=$1",
        //   [userName]
        // );
        // console.log('fnd', fndResult);

        // await pool.query(
        //   "INSERT INTO user_menu_assignment (user_id,menu_Id ) VALUES ($1, $2 ) RETURNING *",
        //   [fndResult.rows[0].user_id, 5]
        // );

        authenticationMethod = {
          flag: "phone",
          value: work_telephone,
        };
      }

      return res.status(200).send({
        message: "Sign up complete!",
        authenticationMethod,
        user: type,
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

      // const fndId = await pool.query(
      //   'INSERT INTO "fnd_user"(user_name, user_password, start_date, status, user_category, user_sub_category) VALUES($1, $2, $3, $4, $5, $6) RETURNING *',
      //   [userName, hashedPassword, currentDate, "pending", "Public", "Business Partner"]
      // );

      // await pool.query(
      //   "INSERT INTO co_seller_users (user_id,hierarchy_id,hierarchy_line_id,hierarchy_line_num) VALUES ($1,$2,$3,$4)",
      //   [fndId.rows[0].user_id, 1, 0, 0]
      // );

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

      // const fndResult = await pool.query(
      //   "SELECT user_id, user_name FROM fnd_user WHERE user_name=$1",
      //   [userName]
      // );
      // await pool.query(
      //   "INSERT INTO user_menu_assignment (user_id,menu_Id ) VALUES ($1, $2 ) RETURNING *",
      //   [fndResult.rows[0].user_id, 5]
      // );
      return res.status(200).json({
        message: "Sign up complete!",
        authenticationMethod,
        user: "PUBLIC",
      });
    }
  } catch (error) {
    // Error handling
    next(error);
  }
});

module.exports = router;
