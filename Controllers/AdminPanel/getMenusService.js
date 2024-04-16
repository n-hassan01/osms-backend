const express = require("express");
const pool = require("../../dbConnection");
const router = express.Router();

router.get("/", async (req, res, next) => {
  await pool.query(
    "SELECT * FROM menus ",

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

router.get("/peruser/:user_id", async (req, res, next) => {
  const userId = req.params.user_id;
  console.log(userId);
  await pool.query(
    "Select menus.menu_description, user_menu_assignment.from_date, user_menu_assignment.to_date, user_menu_assignment.user_id, user_menu_assignment.menu_id From user_menu_assignment join menus ON user_menu_assignment.menu_id = menus.menu_id where user_id = $1 ",
    [userId],
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
