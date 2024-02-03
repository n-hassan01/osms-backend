const express = require("express");
const pool = require("../../dbConnection");
const router = express.Router();

router.post("/", async (req, res, next) => {
  const { userId } = req.body;
  console.log("req", userId);
  await pool.query(
    "SELECT * FROM wf_notifications_v where recipient_role=$1 ORDER BY sent_date DESC",
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
