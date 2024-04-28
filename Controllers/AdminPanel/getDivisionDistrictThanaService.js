const express = require("express");
const pool = require("../../dbConnection");
const router = express.Router();

router.get("/division", async (req, res, next) => {
  await pool.query(
    "SELECT * FROM division",

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

router.get("/district", async (req, res, next) => {
  await pool.query("SELECT * FROM district", (error, result) => {
    try {
      if (error) throw error;

      res.status(200).json(result.rows);
    } catch (err) {
      next(err);
    }
  });
});

router.get("/thana", async (req, res, next) => {
  await pool.query("SELECT * FROM thana", (error, result) => {
    try {
      if (error) throw error;

      res.status(200).json(result.rows);
    } catch (err) {
      next(err);
    }
  });
});

router.get(
  "/get-per-division/district/:division_id",
  async (req, res, next) => {
    const divisionId = req.params.division_id;
    await pool.query(
      "SELECT * FROM district where division_id=$1",
      [divisionId],
      (error, result) => {
        try {
          if (error) throw error;

          res.status(200).json(result.rows);
        } catch (err) {
          next(err);
        }
      }
    );
  }
);

router.get("/get-per-district/thana/:district_id", async (req, res, next) => {
  const districtId = req.params.district_id;
  await pool.query(
    "SELECT * FROM thana where district_id=$1",
    [districtId],
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

router.get("/get-per-division-thana/:division_id", async (req, res, next) => {
  const divisionId = req.params.division_id;
  await pool.query(
    "SELECT * FROM thana where division_id=$1",
    [divisionId],
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

module.exports = router;
