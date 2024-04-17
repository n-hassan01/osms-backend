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

module.exports = router;
