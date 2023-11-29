const express = require("express");
const pool = require("../../dbConnection");
const router = express.Router();

router.get("/:sub_menu_id", async (req, res, next) => {
    const subMenuId = req.params.sub_menu_id;
  await pool.query(
    "SELECT * FROM sub_menu where sub_menu_id= $1",
    [subMenuId],

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
