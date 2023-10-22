const express = require("express");
const pool = require("../dbConnection");
const router = express.Router();

router.post("/", async (req, res, next) => {
  const { verificationcode, compareOtpp, id } = req.body;

  if (verificationcode === compareOtpp) {
    await pool.query(
      "UPDATE \"user\" SET status = 'approved' where id=$1;", [id],
      (error, result) => {
        try {
          if (error) throw error;

          res
            .status(200)
            .json({ success: true, message: "Successfully Sign Up" });

        } catch (error) {
          console.log(error);

          next(error);
        }
      }
    );
  } else {
    next("Signup failed!")
  }
});

module.exports = router;
