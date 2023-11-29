const express = require("express");
const pool = require("../dbConnection");

const router = express.Router();

router.get("/", async (req, res, next) => {
  req.setValue("");

  res.status(200).send({ message: "Logout successfully!" });
});

module.exports = router;
