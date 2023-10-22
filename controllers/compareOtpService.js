const express = require("express");
const pool = require("../dbConnection");
const router = express.Router();

router.get("/", async (req, res, next) => {
  const { verificationcode } = req.body;
  compareOtpp = req.generatedOtp;

  if (verificationcode === compareOtpp) {
    await pool.query(
      "UPDATE user SET status = 'approved';",
      (error, result) => {
        if (error) {
          throw error;
        }
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
