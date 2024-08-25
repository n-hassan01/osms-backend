const express = require("express");
const pool = require("../../dbConnection");
const router = express.Router();
const Joi = require("joi");
const multer = require("multer");
const path = require("path");
const fs = require("fs");

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

router.get("/layouts", async (req, res, next) => {
  await pool.query(
    "SELECT * FROM brand_store_layouts;",

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

router.get("/brandList", async (req, res, next) => {
  await pool.query(
    "SELECT * FROM fnd_lookup_brands_v;",

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

router.get("/brandingAssetSumReport", async (req, res, next) => {
  await pool.query(
    "select * from branding_asset_sum_report_v;",

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

router.get("/itemsByShop/:shop_id", async (req, res, next) => {
  const shopId = req.params.shop_id;

  await pool.query(
    "SELECT DISTINCT inventory_item_id, item_name, item_category FROM branding_assets_details_v WHERE shop_id=$1",
    [shopId],
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

router.get("/getChildItem/:item_id", async (req, res, next) => {
  const itemId = req.params.item_id;

  await pool.query(
    "SELECT * FROM mtl_system_items_child_v WHERE parent_inventory_item_id=$1;",
    [itemId],
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

router.get("/viewReviewStatus/:asset_id", async (req, res, next) => {
  const assetId = req.params.asset_id;

  await pool.query(
    "SELECT * FROM fa_distribution_history WHERE asset_id=$1 ORDER BY creation_date DESC;",
    [assetId],
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
    reviewStatus: Joi.string().min(0),
    // assignedTo: Joi.number().allow(null),
    // transactionHeaderIdOut: Joi.number().allow(null),
    // transactionUnits: Joi.number().allow(null),
    // retirementId: Joi.number().allow(null),
    // lastUpdateLogin: Joi.number().allow(null),
    // capitalAdjAccountCcid: Joi.number().allow(null),
    // generalFundAccountCcid: Joi.number().allow(null),
    shopId: Joi.number().allow(null),
    createdBy: Joi.number().allow(null),
    brandCode: Joi.string().max(30).min(0),
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
    reviewStatus,
    createdBy,
    brandCode,
  } = req.body;

  try {
    const result = await pool.query(
      "SELECT public.fn_new_seq_id('distribution_id', 'fa_distribution_history')"
    );
    const distributionId = result.rows[0].fn_new_seq_id;
    const today = new Date();

    await pool.query(
      `INSERT INTO public.fa_distribution_history(
          distribution_id, asset_id, date_effective, shop_name, remarks, date_ineffective, shop_id, "RECORD_TYPE", 
          uploaded_filename, review_status, created_by, creation_date, brand_code
        ) VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12, $13) RETURNING distribution_id;`,
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
        reviewStatus,
        createdBy,
        today,
        brandCode,
      ]
    );

    return res
      .status(200)
      .json({ message: "Successfully assigned!", value: distributionId });
  } catch (error) {
    console.error(error);
    return next(error);
  }
});

router.post("/update", async (req, res, next) => {
  const schema = Joi.object({
    distributionId: Joi.number().required(0),
    assetId: Joi.number().allow(null),
    dateEffective: Joi.string().min(0),
    shopName: Joi.string().min(0),
    remarks: Joi.string().min(0),
    dateIneffective: Joi.string().min(0),
    recordType: Joi.string().min(0),
    uploadedFileName: Joi.string().min(0),
    reviewStatus: Joi.string().min(0),
    shopId: Joi.number().allow(null),
    brandCode: Joi.string().max(30).min(0),
  });

  const validation = schema.validate(req.body);

  if (validation.error) {
    console.log(validation.error);

    return res.status(400).send("Invalid inputs");
  }

  const {
    distributionId,
    assetId,
    dateEffective,
    shopName,
    remarks,
    dateIneffective,
    shopId,
    recordType,
    uploadedFileName,
    reviewStatus,
    brandCode,
  } = req.body;

  try {
    await pool.query(
      `UPDATE public.fa_distribution_history
	      SET asset_id=$1, date_effective=$2, shop_name=$3, remarks=$4, date_ineffective=$5, shop_id=$6, "RECORD_TYPE"=$7, 
        uploaded_filename=$8, review_status=$9, brand_code=$10
	    WHERE distribution_id=$10;`,
      [
        assetId,
        dateEffective,
        shopName,
        remarks,
        dateIneffective,
        shopId,
        recordType,
        uploadedFileName,
        reviewStatus,
        distributionId,
        brandCode,
      ]
    );

    return res.status(200).json({ message: "Successfully updated!" });
  } catch (error) {
    console.error(error);
    return next(error);
  }
});

const imageStorage = multer.diskStorage({
  destination(req, file, cb) {
    cb(null, path.join(__dirname, process.env.BRANDING_ASSET_PATH));
  },
  filename(req, file, cb) {
    console.log(file);

    cb(null, `branding_asset_${file.originalname}`);
  },
});

const imageUpload = multer({ storage: imageStorage });

router.post(
  "/image/upload",
  imageUpload.single("file"),
  async (req, res, next) => {
    const fileInfo = req.file;

    if (fileInfo) {
      try {
        res.status(200).send({
          message: "Uploaded successfully!",
          value: fileInfo.filename,
        });
      } catch (error) {
        console.error(error.message);
        next(error);
      }
    } else {
      res.status(400).send({ message: "File not provided or upload failed!" });
    }
  }
);

router.post("/image/download", (req, res) => {
  const location = process.env.BRANDING_ASSET_PATH;
  const filename = req.body.fileName;

  const filePath = path.join(__dirname, location, filename);
  // res.download(`${location}${filename}`, filename);
  res.download(filePath, filename);
});

router.delete("/image/delete/:file_name", (req, res) => {
  const location = process.env.BRANDING_ASSET_PATH;
  const filename = req.params.file_name;

  const filePath = path.join(__dirname, location, filename);

  if (!filePath) {
    return res.status(400).json({ error: "File path is required" });
  }

  if (!fs.existsSync(filePath)) {
    return res.status(404).json({ error: "File not found" });
  }

  fs.unlink(filePath, (err) => {
    if (err) {
      return res.status(500).json({ error: "Unable to delete file" });
    }
    res.status(200).json({ message: "File deleted successfully" });
  });
});

module.exports = router;
