const express = require("express");
const Joi = require("joi");
const pool = require("../../dbConnection");
const router = express.Router();

router.post("/add", async (req, res, next) => {
  const schema = Joi.object({
    description: Joi.string().max(240),
    segment1: Joi.string().max(40).allow(null),
    segment2: Joi.string().max(40).allow(null),
    lastUpdateDate: Joi.string().required(),
    lastUpdatedBy: Joi.number().required(),
    lastUpdateLogin: Joi.number(),
    creationDate: Joi.string().required(),
    createdBy: Joi.number().required(),
  });

  const validation = schema.validate(req.body);

  if (validation.error) {
    console.log(validation.error.message);

    return res.status(400).send("Invalid inputs");
  }

  const {
    description,
    segment1,
    segment2,
    lastUpdateDate,
    lastUpdatedBy,
    lastUpdateLogin,
    creationDate,
    createdBy,
  } = req.body;

  const date = new Date();

  await pool.query(
    "INSERT INTO mtl_categories_b (description, segment1, segment2, last_update_date, last_updated_by,  last_update_login, creation_date, created_by) VALUES ($1, $2, $3, $4, $5, $6, $7, $8) RETURNING *;",
    [
     
      description,
      segment1,
      segment2,
      lastUpdateDate,
      lastUpdatedBy,
      lastUpdateLogin,
      creationDate,
      createdBy,
    ],
    (error, result) => {
      try {
        if (error) throw error;

        return res
          .status(200)
          .json({ message: "Successfully added!", headerInfo: result.rows });
      } catch (err) {
        next(err);
      }
    }
  );
});

router.get("/get", async (req, res, next) => {
  await pool.query("SELECT * FROM mtl_categories_b", (error, result) => {
    try {
      if (error) throw error;
      res.status(200).send(result.rows);
    } catch (err) {
      next(err);
    }
  });
});

// router.get("/get/list", async (req, res, next) => {
//   await pool.query(
//     "SELECT bank_id, bank_code, bank_name FROM banks;",
//     (error, result) => {
//       try {
//         if (error) throw error;
//         res.status(200).send(result.rows);
//       } catch (err) {
//         next(err);
//       }
//     }
//   );
// });

router.get("/get/:category_id", async (req, res, next) => {
  const categoryId = req.params.category_id;
  await pool.query(
    "SELECT * FROM mtl_categories_b WHERE category_id=$1;",
    [categoryId],
    (error, result) => {
      try {
        if (error) throw error;
        res.status(200).send(result.rows[0]);
      } catch (err) {
        next(err);
      }
    }
  );
});

router.put("/update/:category_id", async (req, res, next) => {
  const categoryId = req.params.category_id;

  const schema = Joi.object({
    description: Joi.string().max(240),
    segment1: Joi.string().max(40).allow(null),
    segment2: Joi.string().max(40).allow(null),
    lastUpdateDate: Joi.string().required(),
    lastUpdatedBy: Joi.number().required(),
    lastUpdateLogin: Joi.number(),
    creationDate: Joi.string().required(),
    createdBy: Joi.number().required(),
  });

  const validation = schema.validate(req.body);
  if (validation.error) {
    console.log(validation.error.message);

    return res.status(400).send("Invalid inputs");
  }

  const {
    description,
    segment1,
    segment2,
    lastUpdateDate,
    lastUpdatedBy,
    lastUpdateLogin,
    creationDate,
    createdBy,
  } = req.body;

  const date = new Date();

  await pool.query(
    "UPDATE mtl_categories_b SET description=$1, segment1=$2, segment2=$3, last_update_date=$4, last_updated_by=$5,  last_update_login=$6, creation_date=$7, created_by=$8 WHERE category_id=$9;",
    [
        description,
        segment1,
        segment2,
        lastUpdateDate,
        lastUpdatedBy,
        lastUpdateLogin,
        creationDate,
        createdBy,
        categoryId
    ],
    (error, result) => {
      try {
        if (error) throw error;

        return res.status(200).json({
          message: "Successfully updated!",
          headerInfo: result.rows[0],
        });
      } catch (err) {
        next(err);
      }
    }
  );
});

router.delete("/delete/:category_id", async (req, res, next) => {
  const categoryId = req.params.category_id;
  //const now = new Date();

  await pool.query(
    "DELETE FROM mtl_categories_b WHERE category_id = $1",
    [categoryId],
    (error, result) => {
      try {
        if (error) throw error;

        res.status(200).json(`Deleted with categoryId: ${categoryId}`);
      } catch (err) {
        next(err);
      }
    }
  );
});
module.exports = router;
