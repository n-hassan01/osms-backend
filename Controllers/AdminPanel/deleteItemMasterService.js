const Joi = require("joi");
const express = require("express");
const pool = require("../../dbConnection");

const router = express.Router();

router.put("/", async (req, res, next) => {
  const schema = Joi.object({
    inventoryItemId: Joi.number().max(999999999999999).required(),
    organizationId: Joi.number().max(999999999999999).required(),
  });
  const validation = schema.validate(req.body);

  if (validation.error) {
    console.log(validation.error);

    return res.status(400).send("Invalid inputs");
  }

  const { inventoryItemId, organizationId } = req.body;

  await pool.query(
    'UPDATE mtl_system_items SET enabled_flag=$1 WHERE inventory_item_id=$2 AND organization_id=$3;',
    ["n", inventoryItemId, organizationId],
    (error) => {
      try {
        if (error) throw error;

        return res.status(200).send({ message: "Successfully disabled!" });
      } catch (error) {
        next(error);
      }
    }
  );
});

module.exports = router;
