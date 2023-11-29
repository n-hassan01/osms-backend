const express = require("express");
const pool = require("../../dbConnection");
const router = express.Router();

router.delete("/:system_menu_id", async (req, res, next) => {
  const systemMenuId = req.params.system_menu_id;
  //const now = new Date();

  await pool.query(
    "DELETE FROM main_system_menu WHERE system_menu_id = $1",
    [systemMenuId],
    (error, result) => {
      try {
        if (error) throw error;

        res
          .status(200)
          .json(` Deleted with systemMenuId: ${systemMenuId}`);
      } catch (err) {
        next(err);
      }
    }
  );
});

module.exports = router;
