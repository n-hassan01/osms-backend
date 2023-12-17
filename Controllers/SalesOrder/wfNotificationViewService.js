const express = require("express");
const pool = require("../../dbConnection");

const router = express.Router();

router.get("/:notification_id", async (req, res, next) => {
  const notificationId = req.params.notification_id;

  await pool.query(
    "SELECT * FROM public.wf_notifications_v WHERE notification_id=$1;",
    [notificationId],
    (error, result) => {
      try {
        if (error) throw error;
        res.status(200).send(result.rows[0]);
      } catch (err) {
        next(err);
      }
    }
  );
});

router.get("/final/approved", async (req, res, next) => {
  await pool.query(
    "SELECT * FROM wf_notifications WHERE status='APPROVE';",
    (error, result) => {
      try {
        if (error) throw error;
        res.status(200).send(result.rows[0]);
      } catch (err) {
        next(err);
      }
    }
  );
});

module.exports = router;
