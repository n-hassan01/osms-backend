const express = require("express");
const pool = require("../../dbConnection");
const getCurrentDate = require("../Utils/getCurrentDateFn");
const router = express.Router();
const Joi = require("joi");

router.get("/", async (req, res, next) => {
  await pool.query(
    "SELECT user_id, user_name FROM fnd_user ",

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

router.get("/view", async (req, res, next) => {
  await pool.query("SELECT * FROM fnd_user;", (error, result) => {
    try {
      if (error) throw error;

      const response = {
        count: result.rowCount,
        data: result.rows,
      };

      res.status(200).json(response);
    } catch (err) {
      next(err);
    }
  });
});

router.put("/", async (req, res, next) => {
  const schema = Joi.object({
    userId: Joi.number().required(),
    lastUpdatedBy: Joi.number().required(),
    endDate: Joi.date().allow(null, ""),
    status: Joi.string().required(),
  });
  const validation = schema.validate(req.body);

  if (validation.error) {
    console.log(validation.error);

    res.status(400).send("Invalid inputs");
  }

  const { userId, lastUpdatedBy, endDate, status } = req.body;

  const today = getCurrentDate();

  pool.query(
    "UPDATE public.fnd_user SET last_update_date=$1, last_updated_by=$2, last_update_login=$3, end_date=$4, status=$5 WHERE user_id=$6;",
    [today, lastUpdatedBy, lastUpdatedBy, endDate, status, userId],
    (error, result) => {
      try {
        if (error) throw error;
        console.log(result);

        res.status(200).send({ message: "Successfully updated!" });
      } catch (err) {
        next(err);
      }
    }
  );
});

module.exports = router;
