const express = require("express");
const Joi = require("joi");
const pool = require("../../dbConnection");
const router = express.Router();

router.post("/", async (req, res, next) => {
  try {
    const schema = Joi.object({
      unitOfMeasure: Joi.string().max(25).required(),
      uomCode: Joi.string().max(3).required(),
      uomClass: Joi.string().max(10).required(),
      lastUpdateDate: Joi.string().required(),
      lastUpdatedBy: Joi.string().required(),
      createdBy: Joi.string().required(),
      creationDate: Joi.string().required(),
      lastUpdateLogin: Joi.number(),
      disableDate: Joi.string(),
      description: Joi.string().max(50),
    });
    const validation = schema.validate(req.body);

    if (validation.error) {
      console.log(validation.error);

      res.status(400).send("Invalid inputs");
    }

    const {
      unitOfMeasure,
      uomCode,
      uomClass,
      lastUpdateDate,
      lastUpdatedBy,
      createdBy,
      creationDate,
      lastUpdateLogin,
      description,
    } = req.body;

    const result = await pool.query(
      "SELECT COUNT(*) FROM mtl_units_of_measure WHERE unit_of_measure = $1",
      [unitOfMeasure],
      (error, result) => {
        try {
          if (error) throw error;

          const countExistUserId = result.rows[0].count;
          if (countExistUserId === "0") {
            pool.query(
              "INSERT INTO mtl_units_of_measure( unit_of_measure, uom_code, uom_class, last_update_date, last_updated_by, created_by, creation_date, last_update_login, description) VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9);",
              [
                unitOfMeasure,
                uomCode,
                uomClass,
                lastUpdateDate,
                lastUpdatedBy,
                createdBy,
                creationDate,
                lastUpdateLogin,
                description,
              ],
              (error, result) => {
                if (error) throw error;

                res.status(200).json({ message: "Successfully added!" });
              }
            );
          } else {
            res.status(400).json({ message: "Bad request!" });
          }
        } catch (err) {
          next(err);
        }
      }
    );
  } catch (error) {
    next(error);
  }
});

module.exports = router;