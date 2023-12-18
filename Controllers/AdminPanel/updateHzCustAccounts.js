const express = require("express");
const pool = require("../../dbConnection");
const router = express.Router();

router.put("/:cust_account_id", async (req, res, next) => {
  const custAccountId = req.params.cust_account_id;
  const {
    lastUpdateDate,
    accountNumber,
    lastUpdatedBy,
    creationDate,
    createdBy,
    lastUpdateLogin,
    customerType,
    customerClassCode,
    primarySalesrepId,
    salesChannelCode,
    orderTypeId,
    priceListId,
    subcategoryCode,
    paymentTermId,
    accountName,
  } = req.body;

  await pool.query(
    "UPDATE hz_cust_accounts SET last_update_date = $1,account_number = $2,last_updated_by=$3,creation_date=$4,created_by=$5,last_update_login=$6,customer_type=$7,customer_class_code=$8,primary_salesrep_id=$9,sales_channel_code=$10,order_type_id=$11,price_list_id=$12,subcategory_code=$13,payment_term_id=$14,account_name=$15 WHERE cust_account_id =$16 ",
    [
      lastUpdateDate,
      accountNumber,
      lastUpdatedBy,
      creationDate,
      createdBy,
      lastUpdateLogin,
      customerType,
      customerClassCode,
      primarySalesrepId,
      salesChannelCode,
      orderTypeId,
      priceListId,
      subcategoryCode,
      paymentTermId,
      accountName,
      custAccountId,
    ],
    (error, result) => {
      try {
        if (error) throw error;

        res
          .status(200)
          .json(`Organization modified with custAccountId: ${custAccountId}`);
      } catch (err) {
        next(err);
      }
    }
  );
});

module.exports = router;
