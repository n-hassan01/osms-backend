const Joi = require("joi");
const express = require("express");
const pool = require("../../dbConnection");
const router = express.Router();

router.post("/", async (req, res, next) => {
  const schema = Joi.object({
    userId: Joi.number().required(),
  });

  const validation = schema.validate(req.body);

  if (validation.error) {
    console.log(validation.error.message);
    return res.status(400).send("Bad Request");
  }

  try {
    const { userId } = req.body;

    // Use async/await for better readability and error handling
    const result = await pool.query(
      "INSERT INTO co_seller_users (user_id, hierarchy_id, hierarchy_line_id, hierarchy_line_num) VALUES ($1, $2, $3, $4) RETURNING *;",
      [userId, 1, 0, 0]
    );
    console.log("hool",result.rows[0].user_id);

    // Use res.json() instead of res.status(200).json()
    res.json(result.rows[0]); // Assuming you expect a single row
  } catch (error) {
    console.error(error);
    next(error);
  }
});

module.exports = router;
