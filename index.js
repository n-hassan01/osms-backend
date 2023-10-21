require("dotenv").config();
const express = require("express");
const cors = require("cors");

const SignupService = require("./Controllers/signupService");

const app = express();

app.use(express.json());
app.use(cors());

// routing middleware
app.use("/signup", SignupService);

// error handling middlewares
app.use((req, res, next) => {
  console.log(req.originalUrl);

  next("Requested url not found!");
});

app.use((err, req, res, next) => {
  console.log(err);

  if (err.message) {
    res.status(500).send(err.message);
  } else {
    res.status(500).send("Server side error!");
  }
});

const port = process.env.PORT || 3000;
app.listen(port, () => console.log(`Listening on port ${port}...`));
