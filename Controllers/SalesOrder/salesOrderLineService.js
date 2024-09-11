const express = require("express");
const Joi = require("joi");
const pool = require("../../dbConnection");
const router = express.Router();

router.post("/add", async (req, res, next) => {
  const schema = Joi.object({
    headerId: Joi.number().required(),
    lineNumber: Joi.number().required(),
    inventoryItemId: Joi.number().required(),
    // creationDate: Joi.string().required(),
    createdBy: Joi.number().required(),
    orderedItem: Joi.string().min(0).max(2000),
    orderQuantityUom: Joi.string().min(0).max(3),
    orderedQuantity: Joi.number().allow(null),
    soldFromOrgId: Joi.number().allow(null),
    unitSellingPrice: Joi.number().allow(null),
    totalPrice: Joi.number().allow(null),
    offerQuantity: Joi.number().allow(null),
    totalQuantity: Joi.number().allow(null),
    unitOfferPrice: Joi.number().allow(null),
    inventoryItemCode: Joi.string().min(0).max(40),
  });

  const validation = schema.validate(req.body);

  if (validation.error) {
    console.log(validation.error);

    return res.status(400).send("Invalid inputs");
  }

  const {
    headerId,
    lineNumber,
    inventoryItemId,
    // creationDate,
    createdBy,
    orderedItem,
    orderQuantityUom,
    orderedQuantity,
    soldFromOrgId,
    unitSellingPrice,
    totalPrice,
    offerQuantity,
    totalQuantity,
    unitOfferPrice,
    inventoryItemCode,
  } = req.body;

  const date = new Date();

  await pool.query(
    "INSERT INTO oe_order_lines_all(total_price, open_flag, booked_flag, header_id, line_number, inventory_item_id, creation_date, created_by, ordered_item, order_quantity_uom, ordered_quantity, sold_from_org_id, unit_selling_price, offer_quantity, total_quantity, unit_offer_price, inventory_item_code) VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12, $13, $14, $15, $16, $17) RETURNING line_number, line_id;",
    [
      totalPrice,
      "Y",
      "Y",
      headerId,
      lineNumber,
      inventoryItemId,
      date,
      createdBy,
      orderedItem,
      orderQuantityUom,
      orderedQuantity,
      soldFromOrgId,
      unitSellingPrice,
      offerQuantity,
      totalQuantity,
      unitOfferPrice,
      inventoryItemCode,
    ],
    (error, result) => {
      try {
        if (error) throw error;

        return res
          .status(200)
          .json({ message: "Successfully added!", headerInfo: result.rows });
      } catch (err) {
        next(err);
      }
    }
  );
});

router.get("/get/:header_id", async (req, res, next) => {
  const headerId = req.params.header_id;

  await pool.query(
    "SELECT * FROM public.oe_order_lines_all WHERE header_id=$1;",
    [headerId],
    (error, result) => {
      try {
        if (error) throw error;
        res.status(200).send(result.rows);
      } catch (err) {
        next(err);
      }
    }
  );
});

router.delete("/delete/:line_id", async (req, res, next) => {
  const lineId = req.params.line_id;
  await pool.query(
    "DELETE FROM oe_order_lines_all WHERE line_id = $1",
    [lineId],
    (error, result) => {
      try {
        if (error) throw error;

        res.status(200).json({ message: "Successfully Deleted" });
      } catch (err) {
        next(err);
      }
    }
  );
});

router.put("/update/:line_id", async (req, res, next) => {
  const lineId = req.params.line_id;

  const schema = Joi.object({
    inventoryItemId: Joi.number().required(),
    orderedItem: Joi.string().min(0).max(2000),
    orderQuantityUom: Joi.string().min(0).max(3),
    inventoryItemCode: Joi.string().min(0).max(40),
    // soldFromOrgId: Joi.number().allow(null),
    orderedQuantity: Joi.number().allow(null),
    unitSellingPrice: Joi.number().allow(null),
    totalPrice: Joi.number().allow(null),
    offerQuantity: Joi.number().allow(null),
    totalQuantity: Joi.number().allow(null),
    unitOfferPrice: Joi.number().allow(null),
  });

  const validation = schema.validate(req.body);

  if (validation.error) {
    console.log(validation.error);

    return res.status(400).send("Invalid inputs");
  }

  const {
    inventoryItemId,
    orderedItem,
    orderQuantityUom,
    orderedQuantity,
    // soldFromOrgId,
    unitSellingPrice,
    totalPrice,
    offerQuantity,
    totalQuantity,
    unitOfferPrice,
    inventoryItemCode,
  } = req.body;

  const date = new Date();

  await pool.query(
    "UPDATE oe_order_lines_all SET inventory_item_id=$1, ordered_item=$2, order_quantity_uom=$3, ordered_quantity=$4, unit_selling_price=$5, total_price=$6, offer_quantity=$7, total_quantity=$8, unit_offer_price=$9, inventory_item_code=$10 WHERE line_id=$11;",
    [
      inventoryItemId,
      orderedItem,
      orderQuantityUom,
      orderedQuantity,
      // soldFromOrgId,
      unitSellingPrice,
      totalPrice,
      offerQuantity,
      totalQuantity,
      unitOfferPrice,
      inventoryItemCode,
      lineId,
    ],
    (error, result) => {
      try {
        if (error) throw error;

        return res.status(200).json({ message: "Successfully updated!" });
      } catch (err) {
        next(err);
      }
    }
  );
});

module.exports = router;
