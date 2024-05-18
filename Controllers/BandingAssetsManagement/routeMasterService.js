const express = require("express");
const pool = require("../../dbConnection");
const router = express.Router();
const Joi = require("joi");

router.get("/", async (req, res, next) => {
  await pool.query(
    "SELECT * FROM route_master",

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

router.post("/add", async (req, res, next) => {
  const schema = Joi.object({
    routeName: Joi.string().min(0),
    routeCategory: Joi.string().min(0),
  });

  const validation = schema.validate(req.body);

  if (validation.error) {
    console.log(validation.error);

    return res.status(400).send("Invalid inputs");
  }

  const { routeName, routeCategory } = req.body;

  await pool.query(
    "INSERT INTO route_master(route_name, route_category ) VALUES ($1, $2);",
    [routeName, routeCategory],
    (error, result) => {
      try {
        if (error) throw error;

        return res.status(200).json({ message: "Successfully added!" });
      } catch (err) {
        next(err);
      }
    }
  );
});

router.put("/updateRouteMaster", async (req, res, next) => {
  const routeId = req.body.route_id;
  const routeName = req.body.route_name;
  const routeCategory = req.body.route_category;

  await pool.query(
    "UPDATE route_master SET route_name=$1, route_category=$2 WHERE route_id=$3;",
    [routeName, routeCategory, routeId],
    (error, result) => {
      try {
        if (error) throw error;

        res.status(200).json({ message: "Successfully updated!" });
      } catch (err) {
        next(err);
      }
    }
  );
});

router.delete("/deleteRouteMaster/:route_id", async (req, res, next) => {
  const routeId = req.params.route_id;

  await pool.query(
    "DELETE FROM route_master WHERE route_id = $1",
    [routeId],
    (error, result) => {
      try {
        if (error) throw error;

        res.status(200).json({ message: "Successfully Deleted!" });
      } catch (err) {
        next(err);
      }
    }
  );
});

module.exports = router;
