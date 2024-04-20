const Joi = require("joi");
const express = require("express");
const pool = require("../../dbConnection");
const router = express.Router();

router.put("/", async (req, res, next) => {
  const currentDate = new Date();

  const userId = req.body.userId;
  const menuId = req.body.menuId;
  const fromDate = req.body.fromDate ? req.body.fromDate : currentDate;
  const toDate = req.body.toDate;

  await pool.query(
    "UPDATE public.user_menu_assignment SET from_date=$1, to_date=$2 WHERE user_id=$3 AND menu_id=$4;",
    [fromDate, toDate, userId, menuId],
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

module.exports = router;
