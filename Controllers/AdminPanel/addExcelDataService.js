const Joi = require("joi");
const express = require("express");
const pool = require("../../dbConnection");
const router = express.Router();

router.post("/", async (req, res, next) => {
  console.log("body", req.body);
  const schema = Joi.array().items(
    Joi.object({
      id: Joi.string().required(),
      age: Joi.number().required(),
      name: Joi.string().max(200).required(),
      value: Joi.string().max(200).required(),
    })
  );
  console.log("schema", schema);

  const validation = schema.validate(req.body);

  if (validation.error) {
    console.log(validation.error.message);
    return res.status(400).send("Bad Request");
  }

  try {
    const data = req.body;
    let result;
    for (const item of data) {
      const { id, age, name, value } = item;
      result = await pool.query(
        "INSERT INTO excel_data (id, age, name, value) VALUES ($1, $2, $3, $4) RETURNING *;",
        [id, age, name, value]
      );
      console.log("hool", result.rows);
    }
    res.json(result.rows);
  } catch (error) {
    console.error(error);
    next(error);
  }
});

module.exports = router;
