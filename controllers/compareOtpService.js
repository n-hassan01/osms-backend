const express = require("express");
const pool = require("../dbConnection");

const router = express.Router();



router.get("/", async (req, res, next) => {
  console.log(req.body);

  const { verificationcode } = req.body;
  console.log(verificationcode);
  console.log(JSON.stringify(verificationcode));
  compareOtpp = req.generatedOtp;
  console.log("Compareotp: " + compareOtpp);
  var myBooleanValue = null;
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

    console.log(res);
  } else {
    res.status(200).json({ success: false, message: "Can not Sign Up" });
  }
});

module.exports = router;
