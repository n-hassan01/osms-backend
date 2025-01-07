const express = require("express");
const pool = require("../../dbConnection");
const router = express.Router();
const axios = require("axios");
const Joi = require("joi");

const baTokenUrl = "https://herlan.com/wp-json/remark_herlan/v1/token/generate";
const baDateUrl = "https://herlan.com/wp-json/remark_herlan/v1/data";

async function getBaData(loginToken) {
  console.log("Fetching data with loginToken:", loginToken);

  const limit = 50; // Number of items per request
  let allItems = [];
  let offset = 0;
  let hasMoreData = true; // Flag to control pagination
  const start_date = "2025-01-01"; // Example start date
  const end_date = "2025-01-03"; // Example end date

  try {
    // Loop to fetch data in chunks until no more data is available
    while (hasMoreData) {
      try {
        // Make the API request with pagination and authorization
        const response = await axios.get(`${baDateUrl}`, {
          params: {
            start_date,
            end_date,
            limit,
            offset,
          },
          headers: {
            Authorization: `Bearer ${loginToken}`,
          },
        });
        console.log(response.data.data);

        // Validate response structure
        if (!response?.data?.data) {
          console.error("Invalid response format:", response.data.data);
          throw new Error("Unexpected response format");
        }

        const items = response.data.data; // Extract the current batch of items
        allItems = allItems.concat(items); // Append the new items to the total list

        console.log(
          `Fetched ${items.length} items. Total so far: ${allItems.length}`
        );

        // Check if there are more items to fetch
        hasMoreData = items.length === limit;

        // Update offset for the next request
        offset += limit;
      } catch (err) {
        console.error("Error in chunk fetch:", err.message);
        throw new Error(`Data fetch error: ${err.message}`);
      }
    }

    console.log("All items fetched successfully:", allItems.length);
    return allItems; // Return all collected data
  } catch (error) {
    console.error("Error fetching data:", error.message);
    return []; // Return an empty array to indicate failure
  }
}

router.get("/", async (req, res, next) => {
  try {
    // Extract query parameters
    const { loginToken } = req.query; // Use req.query for query parameters
    console.log("Login Token:", loginToken);

    // Validate loginToken
    if (!loginToken) {
      return res.status(400).json({ message: "Missing loginToken in request" });
    }

    // Fetch data using the token
    const allItems = await getBaData(loginToken);

    // Check if items exist
    if (allItems && allItems.length > 0) {
      res.json({ lists: allItems });
    } else {
      res.status(404).json({ message: "No customers found" });
    }
  } catch (error) {
    console.error("Error fetching data:", error.message);
    res.status(500).json({ message: "Internal Server Error" });
    next(error); // Pass error to the next middleware
  }
});

router.post("/token", async (req, res, next) => {
  try {
    const response = await axios.post(`${baTokenUrl}`, {
      username: "herlanmaindbuser",
      password: "U8Y!x9yl$^t*CcffE!!ExL9y",
    });
    return res.json(response.data); // Send the response back to the client
  } catch (err) {
    console.error(err.message);
    res.status(500).json({ error: err.message });
  }
});

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
          BusinessPartner,
          BusinessPartnerFullName,
          BusinessPartnerCategory,
          BusinessPartnerGrouping,
          BusinessPartnerIDByExtSystem,
          BusinessPartnerType,
        } = element;

        // Correct parameter indexing, 6 fields per record
        values.push(
          `($${index * 6 + 1}, $${index * 6 + 2}, $${index * 6 + 3}, $${
            index * 6 + 4
          }, $${index * 6 + 5}, $${index * 6 + 6})`
        );

        // Correct order of params: matching the number of placeholders
        params.push(
          BusinessPartner,
          BusinessPartnerFullName,
          BusinessPartnerCategory,
          BusinessPartnerGrouping,
          BusinessPartnerIDByExtSystem,
          BusinessPartnerType
        );
      });

      // Generate the query for the batch insert
      const query = `
        INSERT INTO public.customer_from_sap
        (business_partner, business_partner_fullname, business_partner_category, business_partner_grouping, business_partner_id_by_ext_system, business_partner_type)
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
