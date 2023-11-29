const Joi = require("joi");
const express = require("express");
const pool = require("../../dbConnection");
const router = express.Router();

router.post("/", async (req, res, next) => {
  const schema = Joi.object({
    menuDescription: Joi.string().max(100),
    menuActive: Joi.string().max(1),
    systemMenuId: Joi.number().min(0),
   
  });
  const validation = schema.validate(req.body);
  if (validation.error) {
    res.status(400).send("Invalid inputs");
  } else {
    const {
        menuDescription,
        menuActive,
        systemMenuId
      
    } = req.body;

    await pool.query(
      "INSERT INTO menus (menu_description,menu_active, system_menu_id ) VALUES ($1, $2,$3 ) RETURNING * ",
      [
        menuDescription,
        menuActive,
        systemMenuId
      
      ],
      (error, result) => {
        try {
          if (error) throw error;

          res.status(200).json(result.rows[0]);
        } catch (err) {
          next(err);
        }
      }
    );
  }
});

module.exports = router;
