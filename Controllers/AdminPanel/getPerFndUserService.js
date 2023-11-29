const express = require("express");
const pool = require("../../dbConnection");
const router = express.Router();

router.get("/:user_id", async (req, res, next) => {
    const userId = req.params.user_id;
  await pool.query(
    "SELECT * FROM fnd_user where user_id= $1",
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
