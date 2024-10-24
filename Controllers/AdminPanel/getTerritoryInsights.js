const express = require("express");
const pool = require("../../dbConnection");
const router = express.Router();

router.get("/", async (req, res, next) => {
  await pool.query(
    "select * from territory_insights;",

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

router.post("/percompetitors", async (req, res, next) => {
  const { territory_id } = req.body;

  await pool.query(
    `WITH CompetitorData AS (
      SELECT 
        t.territory_id,
        tc.competitor_name,
        tc.competitor_monthly_sales,
        tc.bill_board_count
      FROM public.territory t 
      JOIN public.territory_competitors tc ON t.territory_id = tc.territory_id
    )
    SELECT 
      t.region_id, 
      t.area_id, 
      t.territory_id, 
      t.territory_code, 
      t.tsm_code, 
      t.territory_name, 
      tn.town_id, 
      tn.cust_account_id, 
      tn.town_code, 
      tn.town_name, 
      tn.ambassador_code, 
      tn.ambassador_name, 
      ti.creation_date AS territory_creation_date, 
      ti.created_by AS territory_created_by, 
      ti.last_update_date AS territory_last_update_date, 
      ti.last_updated_by AS territory_last_updated_by, 
      ti.last_update_login AS territory_last_update_login, 
      ti.distributor_count, 
      ti.sales_officer_count, 
      ti.total_outlet_count, 
      ti.company_outlet_count, 
      ti.population_count, 
      ti.monthly_sales_actual, 
      ti.monthly_sales_target, 
      ti.monthly_collection_actual, 
      ti.monthly_collection_target, 
      ARRAY_TO_STRING(ARRAY_AGG(cd.competitor_name), ', ') AS competitor_names,  -- Comma-separated competitor names
      ARRAY_TO_STRING(ARRAY_AGG(cd.competitor_monthly_sales), ', ') AS competitor_monthly_sales,  -- Comma-separated competitor monthly sales
      ARRAY_TO_STRING(ARRAY_AGG(cd.bill_board_count), ', ') AS competitor_bill_board_counts  -- Comma-separated billboard counts
    FROM public.territory t 
    JOIN public.town tn ON t.territory_id = tn.territory_id 
    JOIN public.territory_insights ti ON t.territory_id = ti.territory_id 
    LEFT JOIN CompetitorData cd ON t.territory_id = cd.territory_id  
    WHERE t.territory_id = $1
    GROUP BY 
      t.region_id, 
      t.area_id, 
      t.territory_id, 
      t.territory_code, 
      t.tsm_code, 
      t.territory_name, 
      tn.town_id, 
      tn.cust_account_id, 
      tn.town_code, 
      tn.town_name, 
      tn.ambassador_code, 
      tn.ambassador_name, 
      ti.creation_date, 
      ti.created_by, 
      ti.last_update_date, 
      ti.last_updated_by, 
      ti.last_update_login, 
      ti.distributor_count, 
      ti.sales_officer_count, 
      ti.total_outlet_count, 
      ti.company_outlet_count, 
      ti.population_count, 
      ti.monthly_sales_actual, 
      ti.monthly_sales_target, 
      ti.monthly_collection_actual, 
      ti.monthly_collection_target;`,
    [territory_id],

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

router.post("/percompetitors/sql", async (req, res, next) => {
  const { territory_id } = req.body;
  await pool.query(
    `SELECT t.region_id, t.area_id, t.territory_id, t.territory_code, t.tsm_code, t.territory_name, 
    tn.town_id, tn.cust_account_id, tn.town_code, tn.town_name, tn.ambassador_code, tn.ambassador_name, 
    ti.creation_date AS territory_creation_date, ti.created_by AS territory_created_by, ti.last_update_date AS territory_last_update_date, 
    ti.last_updated_by AS territory_last_updated_by, ti.last_update_login AS territory_last_update_login, 
    ti.distributor_count, ti.sales_officer_count, ti.total_outlet_count, ti.company_outlet_count, 
    ti.population_count, ti.monthly_sales_actual, ti.monthly_sales_target, ti.monthly_collection_actual, ti.monthly_collection_target, 
    tc.creation_date AS competitor_creation_date, tc.created_by AS competitor_created_by, tc.last_update_date AS competitor_last_update_date, 
    tc.last_updated_by AS competitor_last_updated_by, tc.last_update_login AS competitor_last_update_login, 
    tc.competitor_name, tc.competitor_monthly_sales, tc.bill_board_count 
    FROM public.territory t 
    JOIN public.town tn ON t.territory_id = tn.territory_id 
    JOIN public.territory_insights ti ON t.territory_id = ti.territory_id 
    JOIN public.territory_competitors tc ON t.territory_id = tc.territory_id 
    WHERE t.territory_id = $1;`,
    [territory_id],

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
