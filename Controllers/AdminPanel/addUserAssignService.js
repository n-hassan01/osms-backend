const Joi = require("joi");
const express = require("express");
const pool = require("../../dbConnection");
const router = express.Router();

router.post("/", async (req, res, next) => {

    const {
    userId,
    menuId
      
    } = req.body;

    await pool.query(
      "INSERT INTO user_menu_assignment (user_id,menu_Id ) VALUES ($1, $2 ) RETURNING *",
      [
       userId,
        menuId
      
      ],
      (error, result) => {
        try {
          if (error) throw error;

          res.status(200).json(result.rows);
        } catch (err) {
          next(err);
        }
      }
    );
  }
);

module.exports = router;
