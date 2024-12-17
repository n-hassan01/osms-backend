const express = require("express");
const Joi = require("joi");
const pool = require("../../dbConnection");
const router = express.Router();

// get api for all sales target
router.get("/getAll", async (req, res, next) => {
  await pool.query("SELECT * FROM incentive_formula;", (error, result) => {
    try {
      if (error) throw error;

      res.status(200).json(result.rows);
    } catch (err) {
      next(err);
    }
  });
});

// getper  api for specific inventive formula
router.get("/getPerFormula/:so_pct ", async (req, res, next) => {
  const soPct = req.params.so_pct;

  await pool.query(
    "SELECT * FROM incentive_formula where so_pct =$1;",
    [soPct],
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

// add inventive formula api
router.post("/addFormula", async (req, res, next) => {
  const schema = Joi.object({
    soPct: Joi.number().allow(null),
    asmPct: Joi.number().allow(null),
    dsmPct: Joi.number().allow(null),
    salesAdminPct: Joi.number().allow(null),
    expantionTeamPct: Joi.number().allow(null),
    planningTeamPct: Joi.number().allow(null),
    incentivePct: Joi.number().allow(null),
    achievementPct: Joi.number().allow(null),
    startDate: Joi.string().min(0),
    endDate: Joi.string().min(0),
    custGroupId: Joi.number().allow(null),
  });

  const validation = schema.validate(req.body);

  if (validation.error) {
    console.log(validation.error.message);

    return res.status(400).send("Invalid inputs");
  }

  const {
    soPct,
    asmPct,
    dsmPct,
    salesAdminPct,
    expantionTeamPct,
    planningTeamPct,
    incentivePct,
    achievementPct,
    startDate,
    endDate,
    custGroupId,
  } = req.body;

  const date = new Date();

  await pool.query(
    "INSERT INTO incentive_formula(so_pct, asm_pct ,  dsm_pct , sales_admin_pct , expantion_team_pct ,  planning_team_pct , incentive_pct ,achievement_pct , start_date, end_date, cust_group_id) VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11) RETURNING *;",
    [
      soPct,
      asmPct,
      dsmPct,
      salesAdminPct,
      expantionTeamPct,
      planningTeamPct,
      incentivePct,
      achievementPct,
      startDate,
      endDate,
      custGroupId,
    ],
    (error, result) => {
      try {
        if (error) throw error;

        return res
          .status(200)
          .json({ message: "Successfully added!", headerInfo: result.rows });
      } catch (err) {
        next(err);
      }
    }
  );
});

router.put("/updateFormula/:so_pct", async (req, res, next) => {
  const soPct = req.params.so_pct;

  const schema = Joi.object({
    asmPct: Joi.number().allow(null),
    dsmPct: Joi.number().allow(null),
    salesAdminPct: Joi.number().allow(null),
    expantionTeamPct: Joi.number().allow(null),
    planningTeamPct: Joi.number().allow(null),
    incentivePct: Joi.number().allow(null),
    achievementPct: Joi.number().allow(null),
    startDate: Joi.string().min(0),
    endDate: Joi.string().min(0),
    custGroupId: Joi.number().allow(null),
  });

  const validation = schema.validate(req.body);

  if (validation.error) {
    console.log(validation.error);

    return res.status(400).send("Invalid inputs");
  }

  const {
    asmPct,
    dsmPct,
    salesAdminPct,
    expantionTeamPct,
    planningTeamPct,
    incentivePct,
    achievementPct,
    startDate,
    endDate,
    custGroupId,
  } = req.body;

  const date = new Date();

  await pool.query(
    "UPDATE incentive_formula SET asm_pct=$1,  dsm_pct =$2, sales_admin_pct =$3, expantion_team_pct =$4,  planning_team_pct =$5, incentive_pct =$6, achievement_pct =$7, start_date =$8, end_date=$9, cust_group_id =$10 where so_pct =$11  RETURNING *;",
    [
      asmPct,
      dsmPct,
      salesAdminPct,
      expantionTeamPct,
      planningTeamPct,
      incentivePct,
      achievementPct,
      startDate,
      endDate,
      custGroupId,
      soPct,
    ],
    (error, result) => {
      try {
        if (error) throw error;

        return res
          .status(200)
          .json({ message: "Successfully Updated!", headerInfo: result.rows });
      } catch (err) {
        next(err);
      }
    }
  );
});

module.exports = router;
