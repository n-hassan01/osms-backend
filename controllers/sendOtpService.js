const express = require("express");
const pool = require("../dbConnection");

const router = express.Router();

router.get("/", async (req, res, next) => {
  await pool.query(
    "select * from signup full join users on signup.email = users.email order by signup.name asc",
    (error, result) => {
      try {
        if (error) throw error;

        res.status(200).send(result.rows);
      } catch (err) {
        next(err);
      }
    }
  );
});

module.exports = router;