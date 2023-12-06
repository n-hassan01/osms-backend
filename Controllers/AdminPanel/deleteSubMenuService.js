const express = require("express");
const pool = require("../../dbConnection");
const router = express.Router();

router.delete("/:sub_menu_id", async (req, res, next) => {
  const subMenuId = req.params.sub_menu_id;
  //const now = new Date();

  await pool.query(
    "DELETE FROM sub_menu WHERE sub_menu_id = $1",
    [subMenuId],
    (error, result) => {
      try {
        if (error) throw error;

        res
          .status(200)
          .json(` Deleted with Sub Menu Id: ${subMenuId}`);
      } catch (err) {
        next(err);
      }
    }
  );
});

module.exports = router;
