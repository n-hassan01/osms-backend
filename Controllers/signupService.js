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
    next();
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
          next();
        } else {
          const { id, email, phone } = result.rows[0];

          // existing (approved) users can not sign up again
          pool.query(
            'select * from "user" where id=$1',
            [id],
            (error, result) => {
              try {
                if (error) throw error;

                if (
                  result.rowCount > 0 &&
                  result.rows[0].status === "approved"
                ) {
                  res.status(401).send({ message: "Unauthorized!" });
                } else {
                  // if the employee has official email provided by remark, authentication will be done through otp sent to their email
                  // otherwise his official phone number will be sent to the admin to manually authenticate him
                  if (email) {
                    res.status(200).send({
                      message: "Sign up complete!",
                      authenticationMethod: {
                        flag: "email",
                        value: email,
                      },
                    });
                  } else {
                    if (
                      result.rowCount > 0 &&
                      result.rows[0].status === "pending"
                    ) {
                      res.status(400).send({ message: "Signup is pending for admin verification!" });
                    } else {
                      console.log('aaaa');
                      console.log(result.rows);

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

                            res.status(200).send({
                              message: "Sign up complete!",
                              authenticationMethod: {
                                flag: "phone",
                                value: phone,
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
