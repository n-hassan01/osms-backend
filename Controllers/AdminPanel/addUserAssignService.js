const Joi = require("joi");
const express = require("express");
const pool = require("../../dbConnection");
const router = express.Router();

router.post("/", async (req, res, next) => {
  const { userId, menuId, fromDate, toDate } = req.body;
  const currentDate = new Date();

  await pool.query(
    "INSERT INTO user_menu_assignment (user_id,menu_Id,from_date,to_date) VALUES ($1, $2, $3, $4) RETURNING *",
    [userId, menuId, fromDate ? fromDate : currentDate, toDate],
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

module.exports = router;
