const express = require("express");
const pool = require("../../dbConnection");
const router = express.Router();
const axios = require("axios");
const Joi = require("joi");

const username = process.env.USERNAME_TO_GET_CUSTOMER_FROM_SAP;
const password = process.env.PASSWORD_TO_GET_CUSTOMER_FROM_SAP;

router.get("/", async (req, res, next) => {
  const auth = Buffer.from(`${username}:${password}`).toString("base64");
  const chunkSize = 500; // Define a reasonable chunk size
  let allItems = [];
  let skip = 0;
  let hasMoreData = true;

  try {
    while (hasMoreData) {
      const response = await axios.get(
        `https://my411141-api.s4hana.cloud.sap/sap/opu/odata4/sap/api_product/srvd_a2x/sap/product/0002/Product?$top=${chunkSize}&$skip=${skip}`,
        {
          headers: {
            Authorization: `Basic ${auth}`,
          },
        }
      );

      const items = response.data.value;
      allItems = allItems.concat(items); // Append the chunk of data to the full result

      // If the returned items are less than the chunk size, it means we've retrieved all the data
      if (items.length < chunkSize) {
        hasMoreData = false;
      }

      // Update skip value for the next request
      skip += chunkSize;
    }

    // Respond with the aggregated items
    res.json({ items: allItems });
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

// Helper function to chunk the array
function chunkArray(array, chunkSize) {
  const chunks = [];
  for (let i = 0; i < array.length; i += chunkSize) {
    chunks.push(array.slice(i, i + chunkSize));
  }
  return chunks;
}

router.post("/add/all", async (req, res, next) => {
  const { content } = req.body;
  const errors = [];
  const BATCH_SIZE = 500;

  // Split content into smaller chunks
  const batches = chunkArray(content, BATCH_SIZE);

  try {
    // Process each batch sequentially
    for (const batch of batches) {
      const values = [];
      const params = [];

      // Prepare the values and params for each batch insert
      batch.forEach((element, index) => {
        const {
          Product,
          ProductType,
          CreationDateTime,
          CreatedByUser,
          BaseUnit,
        } = element;
        values.push(
          `($${index * 5 + 1}, $${index * 5 + 2}, $${index * 5 + 3}, $${
            index * 5 + 4
          }, $${index * 5 + 5})`
        );
        params.push(
          Product,
          ProductType,
          CreationDateTime,
          CreatedByUser,
          BaseUnit
        );
      });

      // Generate the query for the batch insert
      const query = `
        INSERT INTO public.product_from_sap(product, product_type, creation_date_time, created_by_user, base_unit)
        VALUES ${values.join(", ")};
      `;

      try {
        // Execute the batch insert query
        await pool.query(query, params);
      } catch (err) {
        // Collect the error, but continue with the next batch
        errors.push({ batch, error: err.message });
      }
    }

    // If any errors occurred, return them in the response
    if (errors.length > 0) {
      return res.status(400).json({ message: "Some batches failed", errors });
    }

    return res.status(200).json({ message: "Successfully added all entries!" });
  } catch (err) {
    next(err); // Handle unexpected errors outside the loop
  }
});

module.exports = router;
