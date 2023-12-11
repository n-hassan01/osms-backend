const express = require("express");
const pool = require("../dbConnection");

const router = express.Router();

router.get("/", async (req, res, next) => {
  const id = req.id;

  await pool.query(
    "select * from per_all_peoples p INNER JOIN fnd_user f on p.person_id = f.employee_id where  f.user_name = $1",
    [id],
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
