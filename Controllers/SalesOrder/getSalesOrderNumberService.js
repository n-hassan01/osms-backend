const express = require("express");
const pool = require("../../dbConnection");

const router = express.Router();

router.get("/", async (req, res, next) => {
  await pool.query(
    "select fn_create_so_number();",
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
