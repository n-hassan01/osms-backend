const Joi = require("joi");
const express = require("express");
const pool = require("../../dbConnection");
const router = express.Router();

router.post("/", async (req, res, next) => {
  const schema = Joi.object({
    systemMenuDescription: Joi.string().max(100),
    menuActive: Joi.string().max(1),
    iconPath: Joi.string().max(200),
   
  });
  const validation = schema.validate(req.body);
  if (validation.error) {
    console.log(validation.error.message);
    res.status(400).send("Invalid inputs");
  } else {
    const {
        systemMenuDescription,
        menuActive,
        iconPath,
      
    } = req.body;

    await pool.query(
      "INSERT INTO main_system_menu (system_menu_description,menu_active, icon_path ) VALUES ($1, $2,$3 ) RETURNING * ",
      [
        systemMenuDescription,
        menuActive,
        iconPath,
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
