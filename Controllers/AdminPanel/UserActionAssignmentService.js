const express = require("express");
const Joi = require("joi");
const pool = require("../../dbConnection");
const router = express.Router();

router.get("/actionList/:user_id", async (req, res, next) => {
  const userId = req.params.user_id;

  await pool.query(
    "SELECT * FROM public.user_action_v WHERE user_id=$1;",
    [userId],
    (error, result) => {
      try {
        if (error) throw error;

        return res.status(200).json(result.rows);
      } catch (err) {
        next(err);
      }
    }
  );
});

router.get("/actionList/", async (req, res, next) => {
  await pool.query(
    "SELECT * FROM public.reserved_actions;",
    (error, result) => {
      try {
        if (error) throw error;

        return res.status(200).json(result.rows);
      } catch (err) {
        next(err);
      }
    }
  );
});

router.put("/updateDates", async (req, res, next) => {
  const currentDate = new Date();

  const userId = req.body.user_id;
  const actionId = req.body.action_id;
  const fromDate = req.body.from_date ? req.body.from_date : currentDate;
  const toDate = req.body.to_date;

  await pool.query(
    "UPDATE public.user_action_assignment SET from_date=$1, to_date=$2 WHERE user_id=$3 AND action_id=$4;",
    [fromDate, toDate, userId, actionId],
    (error, result) => {
      try {
        if (error) throw error;

        res.status(200).json({ message: "Successfully updated!" });
      } catch (err) {
        next(err);
      }
    }
  );
});

router.post("/assign", async (req, res, next) => {
  const currentDate = new Date();
  const { userId, actionId, fromDate, toDate } = req.body;

  await pool.query(
    "INSERT INTO public.user_action_assignment(user_id, action_id, from_date, to_date) VALUES($1, $2, $3, $4);",
    [userId, actionId, fromDate ? fromDate : currentDate, toDate],
    (error, result) => {
      try {
        if (error) throw error;

        res.status(200).json({ message: "Successfully assigned!" });
      } catch (err) {
        next(err);
      }
    }
  );
});

router.post("/checkAssignment", async (req, res, next) => {
  const { userId, actionId } = req.body;
  console.log(req.body);

  await pool.query(
    "SELECT * FROM public.user_action_assignment WHERE user_id=$1 AND action_id=$2;",
    [userId, actionId],
    (error, result) => {
      try {
        if (error) throw error;

        const isAssigned = result.rowCount > 0;
        res.status(200).json({ value: isAssigned });
      } catch (err) {
        next(err);
      }
    }
  );
});

module.exports = router;
