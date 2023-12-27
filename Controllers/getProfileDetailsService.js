const express = require("express");
const pool = require("../dbConnection");

const router = express.Router();

router.get("/", async (req, res, next) => {
  const id = req.id; // id = userName

  await pool.query(
    // "select * from per_all_peoples p Full JOIN fnd_user f on p.person_id = f.employee_id Full JOIN hz_cust_accounts c ON c.cust_account_id = f.employee_id where  f.user_name = $1",
    "SELECT * FROM public.user_emp_cust_v WHERE user_name=$1;",
    [id],
    (error, result) => {
      try {
        if (error) throw error;
        console.log(result.rows);
        res.status(200).send(result.rows[0]);
      } catch (err) {
        console.log(err.message);
        next(err);
      }
    }
  );
});

module.exports = router;
