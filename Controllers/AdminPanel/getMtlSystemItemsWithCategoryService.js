const express = require("express");
const pool = require("../../dbConnection");
const router = express.Router();

router.get("/:category_id", async (req, res, next) => {
  const categoryId = req.params.category_id;
  await pool.query(
    "SELECT inventory_item_id, description FROM mtl_system_items where category_id=$1",
    [categoryId],
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
