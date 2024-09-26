const express = require("express");
const pool = require("../../dbConnection");
const router = express.Router();
const axios = require("axios");
const Joi = require("joi");

const username = process.env.USERNAME_TO_GET_CUSTOMER_FROM_SAP;
const password = process.env.PASSWORD_TO_GET_CUSTOMER_FROM_SAP;

router.get("/", async (req, res, next) => {
  const auth = Buffer.from(`${username}:${password}`).toString("base64");

  try {
    const response = await axios.get(
      "https://my411141-api.s4hana.cloud.sap/sap/opu/odata4/sap/api_product/srvd_a2x/sap/product/0002/Product",
      {
        headers: {
          Authorization: `Basic ${auth}`,
        },
      }
    );

    const items = response.data.value;
    res.json({ items });
  } catch (error) {
    console.error(error);
    next(error);
  }
});

router.post("/add", async (req, res, next) => {
  const schema = Joi.object({
    product: Joi.string().min(0),
    productType: Joi.string().min(0),
    creationDateTime: Joi.string().min(0),
    createdByUser: Joi.string().min(0),
    baseUnit: Joi.string().min(0),
  });

  const validation = schema.validate(req.body);

  if (validation.error) {
    console.log(validation.error);

    return res.status(400).send("Invalid inputs");
  }

  const { product, productType, creationDateTime, createdByUser, baseUnit } =
    req.body;

  const date = new Date();

  await pool.query(
    "INSERT INTO public.product_from_sap(product, product_type, creation_date_time, created_by_user, base_unit) VALUES ($1, $2, $3, $4, $5);",
    [product, productType, creationDateTime, createdByUser, baseUnit],
    (error, result) => {
      try {
        if (error) throw error;

        return res.status(200).json({ message: "Successfully added!" });
      } catch (err) {
        next(err);
      }
    }
  );
});

router.post("/add/error", async (req, res, next) => {
  const schema = Joi.object({
    businessPartner: Joi.string().min(0),
    errorCode: Joi.string().min(0),
    errorMessage: Joi.string().min(0),
  });

  const validation = schema.validate(req.body);

  if (validation.error) {
    console.log(validation.error);

    return res.status(400).send("Invalid inputs");
  }

  const { businessPartner, errorCode, errorMessage } = req.body;

  const date = new Date();

  await pool.query(
    "INSERT INTO public.error_captured(business_partner, error_code, error_message) VALUES ($1, $2, $3);",
    [businessPartner, errorCode, errorMessage],
    (error, result) => {
      try {
        if (error) throw error;

        return res.status(200).json({ message: "Successfully added!" });
      } catch (err) {
        next(err);
      }
    }
  );
});

module.exports = router;