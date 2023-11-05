const Joi = require("joi");
const express = require("express");
const pool = require("../../dbConnection");

const router = express.Router();

router.put("/", async (req, res, next) => {
  const schema = Joi.object({
    unitOfMeasure: Joi.string().max(25).required(),
    uomCode: Joi.string().max(3).required(),
    uomClass: Joi.string().max(10).required(),
    lastUpdateDate: Joi.string().required(),
    lastUpdatedBy: Joi.string().required(),
    createdBy: Joi.string().required(),
    creationDate: Joi.string().required(),
    lastUpdateLogin: Joi.number(),
    description: Joi.string().max(50).min(0),
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

  await pool.query(
    "UPDATE mtl_units_of_measure SET uom_code=$1, uom_class=$2, last_update_date=$3, last_updated_by=$4, created_by=$5, creation_date=$6, last_update_login=$7, description=$8 WHERE unit_of_measure = $9;",
    [
      uomCode,
      uomClass,
      lastUpdateDate,
      lastUpdatedBy,
      createdBy,
      creationDate,
      lastUpdateLogin,
      description,
      unitOfMeasure,
    ],
    (error) => {
      try {
        if (error) throw error;

        res.status(200).send({ message: "Successfully updated!" });
      } catch (error) {}
    }
  );
});

module.exports = router;
