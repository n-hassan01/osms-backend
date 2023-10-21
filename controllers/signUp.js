const express = require("express");
const router = express.Router();

router.get("/", async (req, res, next) => {
  console.log("Come to the user sign up page ");
});

module.exports = router;
