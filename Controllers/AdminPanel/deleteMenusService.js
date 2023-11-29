const express = require("express");
const pool = require("../../dbConnection");
const router = express.Router();

router.delete("/:menu_id", async (req, res, next) => {
  const menuId = req.params.menu_id;
  //const now = new Date();

  await pool.query(
    "DELETE FROM menus WHERE menu_id = $1",
    [menuId],
    (error, result) => {
      try {
        if (error) throw error;

        res
          .status(200)
          .json(` Deleted with MenuId: ${menuId}`);
      } catch (err) {
        next(err);
      }
    }
  );
});

module.exports = router;
