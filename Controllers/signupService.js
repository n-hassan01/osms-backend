const Joi = require("joi");
const express = require("express");
const bcrypt = require("bcrypt");
const pool = require("../dbConnection");

const router = express.Router();

router.post("/", async (req, res, next) => {
  const schema = Joi.object({
    id: Joi.string().required(),
    password: Joi.string().min(6).required(),
  });
  const validation = schema.validate(req.body);

  if (validation.error) {
    console.log(validation.error);

    res.status(400).send("Invalid inputs");
    return;
  }

  const hashedPassword = await bcrypt.hash(req.body.password, 10);

  await pool.query(
    "select * from employee where id=$1",
    [req.body.id],
    (error, result) => {
      try {
        if (error) throw error;

        // only remark employee is authorized for signing up 
        if (result.rowCount === 0) {
          res.status(401).send({ message: "Unauthorized!" });
        } else {
          const { email, phone } = result.rows[0];

          // if the employee has official email provided by remark, authentication will be done through otp sent to their email
          // otherwise his official phone number will be sent to the admin to manually authenticate him  
          const flag = email ? email : phone;
          console.log(flag);

          const newUser = {
            id: req.body.id,
            password: hashedPassword,
          };

          pool.query(
            'insert into "user"(id, password, status) values($1, $2, $3) RETURNING *',
            [newUser.id, newUser.password, "pending"],
            (error) => {
              try {
                if (error) throw error;

                res.status(200).send({ message: "Sign up complete!", authenticationMethod: flag });
              } catch (err) {
                next(err);
              }
            }
          );
        }
      } catch (err) {
        next(err);
      }
    }
  );
});

module.exports = router;
