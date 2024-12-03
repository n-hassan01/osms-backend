const express = require("express");
const pool = require("../../dbConnection");
const router = express.Router();

router.get("/", async (req, res, next) => {
  const primarySalesrepCode = req.id;

  await pool.query(
    "SELECT cust_account_id, account_number, full_name, ship_to_address FROM hz_cust_accounts where primary_salesrep_code=$1;",
    [primarySalesrepCode],
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

router.get("/all", async (req, res, next) => {
  await pool.query(
    "SELECT clsv.cust_account_id, clsv.account_number, clsv.full_name, clsv.ship_to_address, clsv.cust_group_id FROM customer_list_security_v clsv;",
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

router.get("/view", async (req, res, next) => {
  const primarySalesrepCode = req.id;

  await pool.query(
    "SELECT clsv.cust_account_id, clsv.account_number, clsv.full_name, clsv.ship_to_address FROM customer_list_security_v clsv where  clsv.cust_group_id =  fn_get_cust_security_mapping($1)",
    [primarySalesrepCode],
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

// router.get("/view", async (req, res, next) => {
//   const primarySalesrepCode = req.id;

//   await pool.query(
//     "SELECT cust_account_id, account_number, full_name, ship_to_address FROM customer_territory_v where employee_number=$1;",
//     [primarySalesrepCode],
//     (error, result) => {
//       try {
//         if (error) throw error;

//         res.status(200).json(result.rows);
//       } catch (err) {
//         next(err);
//       }
//     }
//   );
// });

router.get("/:cust_group_id", async (req, res, next) => {
  const customerGroupId = req.params.cust_group_id;

  await pool.query(
    "SELECT cust_account_id, account_number, full_name, ship_to_address FROM hz_cust_accounts where cust_group_id=$1;",
    [customerGroupId],
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

router.get("/customerGroup/list", async (req, res, next) => {
  await pool.query(
    "SELECT cust_group_id, cust_group_name FROM hz_cust_group;",
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
// router.get("/customerGroup/list", async (req, res, next) => {
//   await pool.query(
//     "SELECT DISTINCT customer_group FROM hz_cust_accounts;",
//     (error, result) => {
//       try {
//         if (error) throw error;

//         res.status(200).json(result.rows);
//       } catch (err) {
//         next(err);
//       }
//     }
//   );
// });

router.get("/profile/mapping", async (req, res, next) => {
  const employeeNumber = req.id;

  await pool.query(
    "SELECT * FROM public.data_security_profile_mapping where employee_number=$1;",
    [employeeNumber],
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

router.get("/mapping/group/:cust_group_id", async (req, res, next) => {
  const customerGroupId = req.params.cust_group_id;

  await pool.query(
    "SELECT * FROM public.data_security_profile_mapping where cust_group_id=$1;",
    [customerGroupId],
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

router.get("/summaryForCustomer", async (req, res, next) => {
  await pool.query(
    "SELECT customer_group, sum(amount) amount FROM public.customer_deposit_all_v GROUP BY customer_group ORDER BY customer_group",
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
