const express = require("express");
const pool = require("../../dbConnection");
const router = express.Router();

router.get("/", async (req, res, next) => {
  await pool.query(
    "SELECT * FROM public.region",

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

router.get("/byCustGroupId", async (req, res, next) => {
  const userName = req.id;
  try {
    const result = await pool.query(
      "SELECT cust_group_id FROM fnd_user WHERE user_name = $1",
      [userName]
    );

    const custGroupId = result.rows[0].cust_group_id;

    console.log(custGroupId);

    await pool.query(
      "SELECT * FROM region where cust_group_id=$1",
      [custGroupId],
      (error, result) => {
        try {
          if (error) throw error;

          res.status(200).json(result.rows);
        } catch (err) {
          next(err);
        }
      }
    );
  } catch (err) {
    next(err);
  }
});

module.exports = router;
