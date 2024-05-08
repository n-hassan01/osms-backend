const express = require("express");
const pool = require("../../dbConnection");
const router = express.Router();

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

router.post("/add", async (req, res, next) => {
  const schema = Joi.object({
    bookTypeCode: Joi.string().min(0).max(60),
    assetId: Joi.number().allow(null),
    unitsAssigned: Joi.number().allow(null),
    dateEffective: Joi.string().min(0),
    codeCombinationId: Joi.number().allow(null),
    locationId: Joi.number().allow(null),
    shopName: Joi.string().min(0),
    brand: Joi.string().min(0),
    assetCost: Joi.number().allow(null),
    periodicExpense: Joi.number().allow(null),
    executionDate: Joi.string().min(0),
    renewDate: Joi.string().min(0),
    remarks: Joi.string().min(0),
    supplierName: Joi.string().min(0),
    transactionHeaderIdIn: Joi.number().allow(null),
    lastUpdateDate: Joi.string().min(0),
    lastUpdatedBy: Joi.number().allow(null),
    dateIneffective: Joi.string().min(0),
    assignedTo: Joi.number().allow(null),
    transactionHeaderIdOut: Joi.number().allow(null),
    transactionUnits: Joi.number().allow(null),
    retirementId: Joi.number().allow(null),
    lastUpdateLogin: Joi.number().allow(null),
    capitalAdjAccountCcid: Joi.number().allow(null),
    generalFundAccountCcid: Joi.number().allow(null),
  });

  const validation = schema.validate(req.body);

  if (validation.error) {
    console.log(validation.error);

    return res.status(400).send("Invalid inputs");
  }

  const {
    bookTypeCod,
    assetI,
    unitsAssigne,
    dateEffectiv,
    codeCombinationI,
    locationI,
    shopNam,
    bran,
    assetCos,
    periodicExpens,
    executionDat,
    renewDat,
    remark,
    supplierName,
    transactionHeaderIdIn,
    lastUpdateDate,
    lastUpdatedBy,
    dateIneffective,
    assignedTo,
    transactionHeaderIdOut,
    transactionUnits,
    retirementId,
    lastUpdateLogin,
    capitalAdjAccountCcid,
    generalFundAccountCcid,
  } = req.body;

  const date = new Date();

  await pool.query(
    "INSERT INTO public.fa_distribution_history(book_type_code, asset_id, units_assigned, date_effective, code_combination_id, location_id, shop_name, brand, asset_cost, periodic_expense, execution_date, renew_date, remarks, supplier_name, transaction_header_id_in, last_update_date, last_updated_by, date_ineffective, assigned_to, transaction_header_id_out, transaction_units, retirement_id, last_update_login, capital_adj_account_ccid, general_fund_account_ccid) VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12, $13, $14, $15, $16, $17, $18, $19, $20, $21, $22, $23, $24, $25);",
    [
      bookTypeCod,
      assetI,
      unitsAssigne,
      dateEffectiv,
      codeCombinationI,
      locationI,
      shopNam,
      bran,
      assetCos,
      periodicExpens,
      executionDat,
      renewDat,
      remark,
      supplierName,
      transactionHeaderIdIn,
      lastUpdateDate,
      lastUpdatedBy,
      dateIneffective,
      assignedTo,
      transactionHeaderIdOut,
      transactionUnits,
      retirementId,
      lastUpdateLogin,
      capitalAdjAccountCcid,
      generalFundAccountCcid,
    ],
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
