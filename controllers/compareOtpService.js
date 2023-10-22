const express = require("express");
const pool = require("../dbConnection");
const router = express.Router();

router.post("/", async (req, res, next) => {
  const { verificationcode, compareOtpp, id } = req.body;
  // compareOtpp = req.generatedOtp;

  if (verificationcode === compareOtpp) {
    await pool.query(
      "UPDATE user SET status = 'approved' where id=$1;", [id],
      (error, result) => {
        if (error) {
          throw error;
        }
        console.log(result);
        res
          .status(200)
          .json({ success: true, message: "Successfully Sign Up" });
      }
    );
  } else {
    res.status(200).json({ success: false, message: "Can not Sign Up" });
  }
});

module.exports = router;
