const express = require("express");
const pool = require("../../dbConnection");
const router = express.Router();

router.post("/", async (req, res, next) => {
  const { userId } = req.body;

  await pool.query(
    "SELECT * FROM wf_notifications_v where recipient_role=$1 and status='OPEN' ORDER BY user_key DESC ",
    [userId],

    (error, result) => {
      try {
        if (error) throw error;

        res.json(result.rows);
      } catch (err) {
        next(err);
      }
    }
  );
});

module.exports = router;
