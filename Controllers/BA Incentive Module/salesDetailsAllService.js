const express = require("express");
const Joi = require("joi");
const pool = require("../../dbConnection");
const router = express.Router();
const axios = require("axios");

// get api for all sales target
router.get("/getAll", async (req, res, next) => {
  await pool.query("SELECT * FROM sales_details_all;", (error, result) => {
    try {
      if (error) throw error;

      res.status(200).json(result.rows);
    } catch (err) {
      next(err);
    }
  });
});

router.post("/add/all", async (req, res, next) => {
  const { content } = req.body; // Assuming the request body has a 'content' array
  console.log(content);

  const errors = [];
  const BATCH_SIZE = 500; // Batch size for each insert

  // Helper function to split content into smaller chunks
  const chunkArray = (array, chunkSize) => {
    const chunks = [];
    for (let i = 0; i < array.length; i += chunkSize) {
      chunks.push(array.slice(i, i + chunkSize));
    }
    return chunks;
  };

  // Helper function to cast to integer, fallback to null if invalid
  const castToInteger = (value) => {
    const castedValue = parseInt(value, 10);
    return isNaN(castedValue) ? null : castedValue; // Return null if invalid integer
  };

  // Split the content into smaller chunks
  const batches = chunkArray(content, BATCH_SIZE);

  try {
    // Process each batch sequentially
    for (const batch of batches) {
      const values = [];
      const params = [];

      // Prepare values and params for each batch insert
      for (const element of batch) {
        const {
          order_date,
          order_number,
          cust_account_id,
          quantity,
          inventory_item_id,
          cust_group_id,
          amount,
          unit_price,
          emp_code,
          last_update_date,
          last_updated_by,
          creation_date,
          created_by,
          last_update_login,
          invoiceDt,
          invoiceTime,
          invoiceNo,
          customerName,
          mobileNo,
          styleCode,
          netAmt,
          discAmt,
          data_source,
        } = element;

        // Cast to integer for order_number, inventory_item_id, and cust_group_id
        const validOrderNumber = castToInteger(order_number);
        const validInventoryItemId = castToInteger(inventory_item_id);
        const validCustGroupId = castToInteger(cust_group_id);

        // Check if any required fields are invalid
        if (
          validOrderNumber === null ||
          validInventoryItemId === null ||
          validCustGroupId === null
        ) {
          // Skip invalid entries and log the error
          errors.push({
            element,
            error:
              "Invalid integer input for order_number, inventory_item_id, or cust_group_id",
          });
          continue; // Skip to the next iteration (continue with valid data)
        }

        // Add placeholders for this row (23 fields per row)
        values.push(
          `($${params.length + 1}, $${params.length + 2}, $${
            params.length + 3
          }, $${params.length + 4}, $${params.length + 5}, $${
            params.length + 6
          }, $${params.length + 7}, $${params.length + 8}, $${
            params.length + 9
          }, $${params.length + 10}, $${params.length + 11}, $${
            params.length + 12
          }, $${params.length + 13}, $${params.length + 14}, $${
            params.length + 15
          }, $${params.length + 16}, $${params.length + 17}, $${
            params.length + 18
          }, $${params.length + 19}, $${params.length + 20}, $${
            params.length + 21
          }, $${params.length + 22}, $${params.length + 23})`
        );

        // Push the corresponding values to the params array
        params.push(
          order_date,
          validOrderNumber, // Use the valid (casted) order_number
          cust_account_id,
          quantity,
          validInventoryItemId, // Use the valid (casted) inventory_item_id
          validCustGroupId, // Use the valid (casted) cust_group_id
          amount,
          unit_price,
          emp_code,
          last_update_date,
          last_updated_by,
          creation_date,
          created_by,
          last_update_login,
          invoiceDt,
          invoiceTime,
          invoiceNo,
          customerName,
          mobileNo,
          styleCode,
          netAmt,
          discAmt,
          data_source // Ensure data_source is correctly added
        );
      }

      // Generate the SQL query for the batch insert
      const query = `
        INSERT INTO sales_details_all
        (order_date, order_number, cust_account_id, quantity, inventory_item_id, cust_group_id, amount, unit_price, emp_code, last_update_date, last_updated_by, creation_date, created_by, last_update_login, invoice_dt, invoice_time, invoice_no, customer_name, mobile_no, style_code, net_amt, disc_amt, data_source)
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

router.put("/update/:order_number", async (req, res, next) => {
  const orderNumber = req.params.order_number;

  const schema = Joi.object({
    orderDate: Joi.string().min(0),
    custAccountId: Joi.number().required(),
    custgroupid: Joi.number().allow(null),
    amount: Joi.number().allow(null),
    lastUpdateDate: Joi.string().min(0),
    lastUpdatedBy: Joi.number().required(),
    creationDate: Joi.string().min(0),
    createdBy: Joi.number().required(),
    lastUpdateLogin: Joi.number().allow(null),
  });

  const validation = schema.validate(req.body);

  if (validation.error) {
    console.log(validation.error);

    return res.status(400).send("Invalid inputs");
  }

  const {
    orderDate,
    custAccountId,
    custgroupid,
    amount,
    lastUpdateDate,
    lastUpdatedBy,
    creationDate,
    createdBy,
    lastUpdateLogin,
  } = req.body;

  const date = new Date();

  await pool.query(
    "UPDATE sales_details_all SET orderDate=$1, cust_account_id=$2,cust_group_id=$3,amount=$4, last_update_date=$5,  last_updated_by=$6, creation_date=$7, created_by=$8,  last_update_login=$9  where order_number=$10  RETURNING *;",
    [
      orderDate,
      custAccountId,
      custgroupid,
      amount,
      lastUpdateDate,
      lastUpdatedBy,
      creationDate,
      createdBy,
      lastUpdateLogin,
      orderNumber,
    ],
    (error, result) => {
      try {
        if (error) throw error;

        return res
          .status(200)
          .json({ message: "Successfully updated!", headerInfo: result.rows });
      } catch (err) {
        next(err);
      }
    }
  );
});

router.get("/pos/:date", async (req, res, next) => {
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
  console.log("type", typeof array);

  const chunks = [];
  for (let i = 0; i < array.length; i += chunkSize) {
    chunks.push(array.slice(i, i + chunkSize));
  }
  return chunks;
}

router.post("/pos/add/all", async (req, res, next) => {
  const { content, userId } = req.body;
  const errors = [];
  const BATCH_SIZE = 500;

  try {
    // Split content into smaller chunks
    const batches = chunkArray(content, BATCH_SIZE);

    for (const batch of batches) {
      const values = [];
      const params = [];

      // Prepare the values and params for each batch insert
      batch.forEach((element, index) => {
        const {
          StoreID,
          SalesQty,
          MRPAmt,
          BAID,
          TransactionDate,
          TransactionTime,
          InvoiceID,
          CustomerName,
          CustomerPhone,
          SKUID,
          NetAmt,
          DiscountAmt,
          SAP_STORE_CODE
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
          SAP_STORE_CODE,
          17,
          null,
          SalesQty,
          MRPAmt,
          0,
          userId,
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
          "POS",
          BAID,
          StoreID
        );
      });

      // Generate the query for the batch insert
      const query = `
        INSERT INTO public.sales_details_all (
          order_date, order_number, cust_account_id, cust_group_id, inventory_item_id, quantity, unit_price, amount, 
          last_updated_by, created_by, emp_code, invoice_dt, invoice_time, invoice_no, customer_name, mobile_no, style_code, 
          net_amt, disc_amt, data_source, pos_emp_code, pos_store_code
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
