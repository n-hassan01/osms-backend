const express = require("express");
const pool = require("../../dbConnection");
const router = express.Router();
const Joi = require("joi");

router.get("/", async (req, res, next) => {
  await pool.query(
    "SELECT * FROM branding_assets_details_v ",

    (error, result) => {
      try {
        if (error) throw error;

        res.status(200).json(result.rows);
      } catch (err) {
        next(err);
      }
    }
  );
});

router.get("/byShop/:shop_name", async (req, res, next) => {
  const shopName = req.params.shop_name;
  
  await pool.query(
    "SELECT * FROM branding_assets_details_v WHERE shop_name=$1",
    [shopName],
    (error, result) => {
      try {
        if (error) throw error;

        res.status(200).json(result.rows);
      } catch (err) {
        next(err);
      }
    }
  );
});

router.post("/add", async (req, res, next) => {
  const schema = Joi.object({
    // bookTypeCode: Joi.string().min(0).max(60),
    assetId: Joi.number().allow(null),
    // unitsAssigned: Joi.number().allow(null),
    dateEffective: Joi.string().min(0),
    // codeCombinationId: Joi.number().allow(null),
    // locationId: Joi.number().allow(null),
    shopName: Joi.string().min(0),
    // brand: Joi.string().min(0),
    // assetCost: Joi.number().allow(null),
    // periodicExpense: Joi.number().allow(null),
    // executionDate: Joi.string().min(0),
    // renewDate: Joi.string().min(0),
    remarks: Joi.string().min(0),
    // supplierName: Joi.string().min(0),
    // transactionHeaderIdIn: Joi.number().allow(null),
    // lastUpdateDate: Joi.string().min(0),
    // lastUpdatedBy: Joi.number().allow(null),
    dateIneffective: Joi.string().min(0),
    recordType: Joi.string().min(0),
    uploadedFileName: Joi.string().min(0),
    // assignedTo: Joi.number().allow(null),
    // transactionHeaderIdOut: Joi.number().allow(null),
    // transactionUnits: Joi.number().allow(null),
    // retirementId: Joi.number().allow(null),
    // lastUpdateLogin: Joi.number().allow(null),
    // capitalAdjAccountCcid: Joi.number().allow(null),
    // generalFundAccountCcid: Joi.number().allow(null),
    shopId: Joi.number().allow(null),
  });

  const validation = schema.validate(req.body);

  if (validation.error) {
    console.log(validation.error);

    return res.status(400).send("Invalid inputs");
  }

  const {
    assetId,
    dateEffective,
    shopName,
    remarks,
    dateIneffective,
    shopId,
    recordType,
    uploadedFileName,
  } = req.body;

  try {
    const result = await pool.query(
      "SELECT public.fn_new_seq_id('distribution_id', 'fa_distribution_history')"
    );
    const distributionId = result.rows[0].fn_new_seq_id;

    await pool.query(
      `INSERT INTO public.fa_distribution_history(
          distribution_id, asset_id, date_effective, shop_name, remarks, date_ineffective, shop_id, "RECORD_TYPE", uploaded_filename
        ) VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9);`,
      [
        distributionId,
        assetId,
        dateEffective,
        shopName,
        remarks,
        dateIneffective,
        shopId,
        recordType,
        uploadedFileName,
      ]
    );

    return res.status(200).json({ message: "Successfully assigned!" });
  } catch (error) {
    console.error(error);
    return next(error);
  }
});

module.exports = router;
