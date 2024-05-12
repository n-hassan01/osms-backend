const express = require("express");
const pool = require("../../dbConnection");
const router = express.Router();
const Joi = require("joi");

router.get("/", async (req, res, next) => {
  await pool.query(
    "SELECT * FROM shop_master;",

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
    shopName: Joi.string().min(0),
    ownerName: Joi.string().min(0),
    address: Joi.string().min(0),
    divisionId: Joi.number().allow(null),
    districtId: Joi.number().allow(null),
    thanaId: Joi.number().allow(null),
    contactNumber: Joi.string().min(0),
    imagePath: Joi.string().min(0),
    geoLocation: Joi.string().min(0),
    routeId: Joi.number().allow(null),
  });

  const validation = schema.validate(req.body);

  if (validation.error) {
    console.log(validation.error);

    return res.status(400).send("Invalid inputs");
  }

  const {
    shopName,
    ownerName,
    address,
    divisionId,
    districtId,
    thanaId,
    contactNumber,
    imagePath,
    geoLocation,
    routeId,
  } = req.body;

  const date = new Date();

  await pool.query(
    "INSERT INTO public.shop_master(shop_name, owner_name, address, division_id, district_id, thana_id, contact_number, image_path, geo_location, route_id) VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10);",
    [
      shopName,
      ownerName,
      address,
      divisionId,
      districtId,
      thanaId,
      contactNumber,
      imagePath,
      geoLocation,
      routeId,
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

router.put("/update/:shop_id", async (req, res, next) => {
  const shopId = req.params.shop_id;

  const schema = Joi.object({
    shopName: Joi.string().min(0),
    ownerName: Joi.string().min(0),
    address: Joi.string().min(0),
    divisionId: Joi.number().allow(null),
    districtId: Joi.number().allow(null),
    thanaId: Joi.number().allow(null),
    contactNumber: Joi.string().min(0),
    imagePath: Joi.string().min(0),
    geoLocation: Joi.string().min(0),
    routeId: Joi.number().allow(null),
  });

  const validation = schema.validate(req.body);

  if (validation.error) {
    console.log(validation.error);

    return res.status(400).send("Invalid inputs");
  }

  const {
    shopName,
    ownerName,
    address,
    divisionId,
    districtId,
    thanaId,
    contactNumber,
    imagePath,
    geoLocation,
    routeId,
  } = req.body;

  const date = new Date();

  await pool.query(
    "UPDATE public.shop_master SET shop_name=$1, owner_name=$2, address=$3, division_id=$4, district_id=$5, thana_id=$6, contact_number=$7, image_path=$8, geo_location=$9, route_id=$10 WHERE shop_id=$11;",
    [
      shopName,
      ownerName,
      address,
      divisionId,
      districtId,
      thanaId,
      contactNumber,
      imagePath,
      geoLocation,
      routeId,
      shopId,
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

router.delete("/delete/:shop_id", async (req, res, next) => {
  const shopId = req.params.shop_id;

  await pool.query(
    "DELETE FROM shop_master WHERE shop_id = $1",
    [shopId],
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

module.exports = router;
