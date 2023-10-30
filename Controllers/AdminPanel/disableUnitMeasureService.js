const Joi = require("joi");
const express = require("express");
const pool = require("../../dbConnection");

const router = express.Router();

router.put("/", async (req, res, next) => {
  try {
    const schema = Joi.object({
      unitOfMeasure: Joi.string().max(25).required(),
      disableDate: Joi.string().required(),
    });
    const validation = schema.validate(req.body);

    if (validation.error) {
      console.log(validation.error);

      res.status(400).send("Invalid inputs");
    }

    const { unitOfMeasure, disableDate } = req.body;

    await pool.query(
      "UPDATE mtl_units_of_measure SET disable_date = $1 WHERE unit_of_measure = $2",
      [disableDate, unitOfMeasure],
      (error) => {
        if (error) throw error;

        res.status(200).send({ message: "Successfully disabled!" });
      }
    );
  } catch (error) {
    next(error);
  }
});

module.exports = router;
