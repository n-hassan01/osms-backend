const express = require("express");
const pool = require("../dbConnection");

const router = express.Router();

router.get("/", async (req, res, next) => {
  // if (!req.id || !req.role) {
  //   next("No user logged in!");
  // }
  if (!req.id) {
    res.status(401).send("No user logged in!");
  }

  const loggedInUser = {
    id: req.id,
    role: req.role,
  };

  res.status(200).send(loggedInUser);
});

module.exports = router;
