const express = require("express");
const pool = require("../dbConnection");
const router = express.Router();
const bcrypt = require("bcrypt");

router.post("/", async (req, res, next) => {
  const {
    verificationCode,
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

  try {
    const result = await pool.query("SELECT otp FROM otp WHERE id = $1", [
      userName,
    ]);

    // console.log(result);

    if (result.rows.length === 0) {
      return res.status(404).json({ message: "OTP not found" });
    }

    const generatedOtp = result.rows[0].otp;
    const hashedOtp = await bcrypt.hash(generatedOtp, 10);
    const isOtpValid = await bcrypt.compare(verificationCode, hashedOtp);

    const currentDate = new Date().toJSON();

    if (isOtpValid) {
      // Hash the password
      const hashedPassword = await bcrypt.hash(password, 10);
      if (userType === "Private") {
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

        const userId = person_id ? person_id : cust_account_id;
        const subCatagory = person_id ? "Employee" : "Business partner";

        const insertedUser = await pool.query(
          'INSERT INTO "fnd_user"(user_name, user_password, start_date, employee_id, status, user_category, user_sub_category) VALUES($1, $2, $3, $4, $5, $6, $7) RETURNING *',
          [
            userName,
            hashedPassword,
            currentDate,
            userId,
            "approved",
            "Private",
            subCatagory,
          ]
        );

        res
          .status(200)
          .json({ message: "OTP matched!", user: insertedUser.rows[0] });
      } else {
        const insertedUser = await pool.query(
          'INSERT INTO "hz_cust_accounts"(account_number, user_category, full_name, nid, user_age, user_gender, user_profession, user_org, user_address, last_update_date, last_updated_by, creation_date, created_by) VALUES($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12, $13) RETURNING *',
          [
            userName,
            userType,
            name,
            nid,
            age,
            gender,
            profession,
            orgaization,
            address,
            currentDate,
            1,
            currentDate,
            1,
          ]
        );

        await pool.query(
          "UPDATE fnd_user SET status=$1, employee_id=$2 WHERE user_name=$3",
          ["approved", insertedUser.cust_account_id, userName]
        );

        res.status(200).json({ message: "OTP matched!" });
      }
    } else {
      return res.status(401).json({ message: "Invalid OTP" });
    }
  } catch (error) {
    next(error);
  }
});

module.exports = router;
