const express = require("express");
const Joi = require("joi");
const pool = require("../../dbConnection");
const router = express.Router();

router.post("/", async (req, res, next) => {
  try {
    console.log(req.body);
    const schema = Joi.object({
      unitOfMeasure: Joi.string().max(25).required(),
      uomCode: Joi.string().max(3).required(),
      uomClass: Joi.string().max(10).required(),
      lastUpdateDate: Joi.string().required(),
      lastUpdatedBy: Joi.string().required(),
      createdBy: Joi.string().required(),
      creationDate: Joi.string().required(),
      // lastUpdateLogin: Joi.number(),
      description: Joi.string().max(50).allow(null, "").optional(),
    });

    const validation = schema.validate(req.body);

    if (validation.error) {
      console.log(validation.error);
      return res.status(400).json({ error: "Invalid inputs" });
    }

    const {
      unitOfMeasure,
      uomCode,
      uomClass,
      lastUpdateDate,
      lastUpdatedBy,
      createdBy,
      creationDate,
      // lastUpdateLogin,
      description,
    } = req.body;

    const existingUnitQuery =
      "SELECT COUNT(*) FROM mtl_units_of_measure WHERE unit_of_measure = $1";
    const insertUnitQuery =
      "INSERT INTO mtl_units_of_measure( unit_of_measure, uom_code, uom_class, last_update_date, last_updated_by, created_by, creation_date, last_update_login, description) VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9)";

    const existingUnitResult = await pool.query(existingUnitQuery, [
      unitOfMeasure,
    ]);
    const countExistUserId = existingUnitResult.rows[0].count;

    if (countExistUserId === "0") {
      await pool.query(insertUnitQuery, [
        unitOfMeasure,
        uomCode,
        uomClass,
        lastUpdateDate,
        lastUpdatedBy,
        createdBy,
        creationDate,
        null,
        description,
      ]);

      return res.status(200).json({ message: "Successfully added!" });
    } else {
      return res
        .status(400)
        .json({ message: "Unit of measure already exists!" });
    }
  } catch (error) {
    next(error);
  }
});

module.exports = router;
