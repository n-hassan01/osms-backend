const express = require("express");
const pool = require("../../dbConnection");
const router = express.Router();

router.get("/:menu_id", async (req, res, next) => {
    const menuId = req.params.menu_id;
  await pool.query(
    "SELECT * FROM menus where menu_id= $1",
    [menuId],

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
