const Joi = require("joi");
const express = require("express");
const pool = require("../../dbConnection");
const router = express.Router();

router.post("/", async (req, res, next) => {
  const schema = Joi.object({
    subMenuDescription: Joi.string().max(100),
    subMenuAction: Joi.string().max(100),
    subMenuActive: Joi.string().max(1),
    subMenuType:Joi.string().max(50),
    slno: Joi.number().min(0),
    menuId: Joi.number().min(0),
  });
  const validation = schema.validate(req.body);
  if (validation.error) {
    res.status(400).send("Invalid inputs");
  } else {
    const {
    subMenuDescription,
    subMenuAction,
    subMenuActive,
    subMenuType,
    slno,
    menuId,
      
    } = req.body;

    await pool.query(
      "INSERT INTO sub_menu (sub_menu_description,sub_menu_action, sub_menu_active, sub_menu_type ,  slno ,menu_id) VALUES ($1, $2,$3,$4,$5,$6 ) RETURNING *",
      [
        subMenuDescription,
        subMenuAction,
        subMenuActive,
        subMenuType,
        slno,
        menuId,
      
      ],
      (error, result) => {
        try {
          if (error) throw error;

          res.status(200).json({ message: "Successfully completed adding" });
        } catch (err) {
          next(err);
        }
      }
    );
  }
});

module.exports = router;
