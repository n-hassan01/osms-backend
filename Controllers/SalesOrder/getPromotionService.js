const express = require("express");
const pool = require("../../dbConnection");

const router = express.Router();

router.get("/", async (req, res, next) => {
  const userName = req.params.username;

  await pool.query(
    "SELECT file_name FROM public.promotion;",
    (error, result) => {
      try {
        if (error) throw error;

        const fileNames = result.rows.map((obj) => obj.file_name);
        console.log(fileNames);

        res.status(200).send(fileNames);
      } catch (err) {
        console.log(err.message);
        next(err);
      }
    }
  );
});

module.exports = router;
