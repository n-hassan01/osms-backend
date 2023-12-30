const express = require("express");
const Joi = require("joi");
const pool = require("../../dbConnection");
const router = express.Router();

router.post("/", async (req, res, next) => {
  const schema = Joi.object({
    itemId: Joi.number().required(),
    orgId: Joi.number().required(),
  });

  const validation = schema.validate(req.body);

  if (validation.error) {
    console.log(validation.error);

    return res.status(400).send("Invalid inputs");
  }

  const { itemId, orgId } = req.body;

  await pool.query(
    "SELECT public.fn_get_item_price($1,$2);",
    [itemId, orgId],
    (error, result) => {
      try {
        if (error) throw error;

        return res.status(200).json(result.rows);
      } catch (err) {
        next(err);
      }
    }
  );
});

module.exports = router;
