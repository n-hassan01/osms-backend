const express = require("express");
const pool = require("../../dbConnection");
const router = express.Router();

router.put("/:notification_id", async (req, res, next) => {
  const notificationId = req.params.notification_id;
  

  await pool.query(
    "DELETE FROM wf_notifications WHERE notification_id = $1",
    [notificationId],
    (error, result) => {
      try {
        if (error) throw error;

        res
          .status(200)
          .json(` Deleted with Id: ${notificationId}`);
      } catch (err) {
        next(err);
      }
    }
  );
});

module.exports = router;
