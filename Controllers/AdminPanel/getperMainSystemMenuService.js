const express = require("express");
const pool = require("../../dbConnection");
const router = express.Router();

router.get("/:system_menu_id", async (req, res, next) => {
    const systemMenuId = req.params.system_menu_id;
  await pool.query(
    "SELECT * FROM main_system_menu where system_menu_id= $1",
    [systemMenuId],

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
