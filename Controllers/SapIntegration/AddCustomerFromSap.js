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
      "https://my411141-api.s4hana.cloud.sap:443/sap/opu/odata/sap/API_BUSINESS_PARTNER/A_BusinessPartner?$inlinecount=allpages&$format=json",
      {
        headers: {
          Authorization: `Basic ${auth}`,
        },
      }
    );

    const customers = response.data.d.results;
    res.json(customers);
  } catch (error) {
    console.error(error);
    next(error);
  }
});

router.get("/get-address", async (req, res, next) => {
  const auth = Buffer.from(`${username}:${password}`).toString("base64");

  try {
    const response = await axios.get(
      "https://my411141-api.s4hana.cloud.sap:443/sap/opu/odata/sap/API_BUSINESS_PARTNER/A_BusinessPartner?$inlinecount=allpages&$format=json",
      {
        headers: {
          Authorization: `Basic ${auth}`,
        },
      }
    );

    const customers = response.data.d.results;
    res.json(customers);
  } catch (error) {
    console.error(error);
    next(error);
  }
});

router.post("/add", async (req, res, next) => {
  const schema = Joi.object({
    businessPartner: Joi.string().min(0),
    businessPartnerFullname: Joi.string().min(0),
    businessPartnerCategory: Joi.number().allow(null),
    businessPartnerGrouping: Joi.string().min(0),
    businessPartnerIdByExtSystem: Joi.string().min(0),
    businessPartnerType: Joi.string().min(0),
  });

  const validation = schema.validate(req.body);

  if (validation.error) {
    console.log(validation.error);

    return res.status(400).send("Invalid inputs");
  }

  const {
    businessPartner,
    businessPartnerFullname,
    businessPartnerCategory,
    businessPartnerGrouping,
    businessPartnerIdByExtSystem,
    businessPartnerType,
  } = req.body;

  const date = new Date();

  await pool.query(
    "INSERT INTO public.customer_from_sap(business_partner, business_partner_category, business_partner_fullname, business_partner_grouping, business_partner_id_by_ext_system, business_partner_type) VALUES ($1, $2, $3, $4, $5, $6);",
    [
      businessPartner,
      businessPartnerCategory,
      businessPartnerFullname,
      businessPartnerGrouping,
      businessPartnerIdByExtSystem,
      businessPartnerType,
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
