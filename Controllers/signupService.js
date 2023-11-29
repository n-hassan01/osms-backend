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
  }

  const hashedPassword = await bcrypt.hash(req.body.password, 10);

  await pool.query(
    "select * from per_all_peoples where employee_number=$1",
    [req.body.id],
    (error, result) => {
      try {
        if (error) throw error;

        // only remark employee is authorized for signing up
        if (result.rowCount === 0) {
          res.status(401).send({ message: "Unauthorized!" });
        } else {
          const { employee_number, email_address, work_telephone } =
            result.rows[0];

          pool.query(
            'select * from "fnd_user" where user_name=$1',
            [employee_number],
            (error, result) => {
              try {
                if (error) throw error;

                // existing (approved) users can not sign up again
                if (
                  result.rowCount > 0 &&
                  result.rows[0].status === "approved"
                ) {
                  res.status(401).send({ message: "Unauthorized!" });
                } else {
                  // if the employee has official email provided by remark, authentication will be done through otp sent to their email
                  // otherwise his official phone number will be sent to the admin to manually authenticate him
                  if (email_address) {
                    res.status(200).send({
                      message: "Sign up complete!",
                      authenticationMethod: {
                        flag: "email",
                        value: email_address,
                      },
                    });
                  } else {
                    if (
                      result.rowCount > 0 &&
                      result.rows[0].status === "pending"
                    ) {
                      res.status(400).send({
                        message: "Signup is pending for admin verification!",
                      });
                    } else {
                      console.log("aaaa");
                      console.log(result.rows);

                      const newUser = {
                        id: req.body.id,
                        password: hashedPassword,
                      };

                      const currentDate = new Date().toJSON();

                      pool.query(
                        'insert into "fnd_user"(user_name, user_password, start_date, status) values($1, $2, $3, $4) RETURNING *',
                        [newUser.id, newUser.password, currentDate, "pending"],
                        (error) => {
                          try {
                            if (error) throw error;

                            res.status(200).send({
                              message: "Sign up complete!",
                              authenticationMethod: {
                                flag: "phone",
                                value: work_telephone,
                              },
                              user: newUser.id,
                            });
                          } catch (err) {
                            next(err);
                          }
                        }
                      );
                    }
                  }
                }
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
