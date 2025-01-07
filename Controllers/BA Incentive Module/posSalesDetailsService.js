const express = require("express");
const pool = require("../../dbConnection");
const router = express.Router();
const axios = require("axios");
const Joi = require("joi");

router.get("/:date", async (req, res, next) => {
  const date = req.params.date;
  const chunkSize = 500;
  let allItems = [];

  try {
    const authResponse = await axios.get(
      "http://182.160.114.100:9011/demo/api/external/login?username=mahatab&password=123"
    );

    if (authResponse.status === 200) {
      const { UserName, ApiKey } = authResponse.data;
      const auth = `${UserName}:${ApiKey}`;

      const salesResponse = await axios.get(
        `http://182.160.114.100:9011/demo/api/app/GetSaleExportData/1/1/${date}`,
        {
          headers: { Authorization: auth },
        }
      );

      const count = salesResponse.data.COUNT;
      const pageNo = Math.ceil(count / chunkSize);

      for (let i = 1; i <= pageNo; i++) {
        const response = await axios.get(
          `http://182.160.114.100:9011/demo/api/app/GetSaleExportData/${i}/${chunkSize}/${date}`,
          {
            headers: { Authorization: auth },
          }
        );

        const sales = response.data.Data;
        allItems = allItems.concat(sales);
      }

      return res.json({ salesDetails: allItems });
    } else {
      return res.status(401).json({
        error: "Authentication failed! Provide valid username and password",
      });
    }
  } catch (error) {
    console.error("Error fetching sales data:", error.message || error);
    next(error);
  }
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
    for (const batch of batches) {
      const values = [];
      const params = [];

      // Prepare the values and params for each batch insert
      batch.forEach((element, index) => {
        const {
          StoreID,
          SalesQty,
          MRPAmt,
          userId,
          BAID,
          TransactionDate,
          TransactionTime,
          InvoiceID,
          CustomerName,
          CustomerPhone,
          SKUID,
          NetAmt,
          DiscountAmt,
        } = element;

        const offset = index * 20; // Each batch entry uses 20 placeholders
        values.push(
          `($${offset + 1}, $${offset + 2}, $${offset + 3}, $${offset + 4}, $${
            offset + 5
          }, $${offset + 6}, $${offset + 7}, $${offset + 8}, 
            $${offset + 9}, $${offset + 10}, $${offset + 11}, $${
            offset + 12
          }, $${offset + 13}, $${offset + 14}, $${offset + 15}, $${
            offset + 16
          }, 
            $${offset + 17}, $${offset + 18}, $${offset + 19}, $${offset + 20})`
        );
        params.push(
          TransactionDate,
          InvoiceID,
          StoreID,
          17,
          SKUID,
          SalesQty,
          MRPAmt,
          NetAmt,
          1,
          1,
          BAID,
          TransactionDate,
          TransactionTime,
          InvoiceID,
          CustomerName,
          CustomerPhone,
          SKUID,
          NetAmt,
          DiscountAmt,
          "POS"
        );
      });

      // Generate the query for the batch insert
      const query = `
        INSERT INTO public.sales_details_all (
          order_date, order_number, cust_account_id, cust_group_id, inventory_item_id, quantity, unit_price, amount, 
          last_updated_by, created_by, emp_code, invoice_dt, invoice_time, invoice_no, customer_name, mobile_no, style_code, net_amt, disc_amt, data_source
        ) 
        VALUES ${values.join(", ")};
      `;

      try {
        // Execute the batch insert query
        await pool.query(query, params);
      } catch (err) {
        // Collect the error details for debugging
        errors.push({
          batch: batch.map((b) => b.InvoiceID),
          error: err.message,
        });
      }
    }

    // If any errors occurred, return them in the response
    if (errors.length > 0) {
      return res.status(400).json({
        message: "Some batches failed",
        errors,
      });
    }

    return res.status(200).json({ message: "Successfully added all entries!" });
  } catch (err) {
    console.error("Unexpected error:", err.message || err);
    next(err); // Pass unexpected errors to the Express error handler
  }
});

module.exports = router;

module.exports = router;
