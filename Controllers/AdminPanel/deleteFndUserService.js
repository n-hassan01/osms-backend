const express = require("express");
const pool = require("../../dbConnection");
const router = express.Router();

router.delete("/:user_id", async (req, res, next) => {
  const userId = req.params.user_id;
  //const now = new Date();

  await pool.query(
    "DELETE FROM fnd_user WHERE user_id = $1",
    [userId],
    (error, result) => {
      try {
        if (error) throw error;

        res
          .status(200)
          .json(`Deleted with user_id: ${userId}`);
      } catch (err) {
        next(err);
      }
    }
  );
});

module.exports = router;
