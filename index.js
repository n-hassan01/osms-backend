require("dotenv").config();
const express = require("express");
const cors = require("cors");
const app = express();

//routing api
const sendOtpService = require("./controllers/sendOtpService");
const sendOtpMiddleware = require("../osms-backend/middlewares/sendOtpMiddleware");
const compareOtp = require("./controllers/compareOtpService");
const signUp = require("../osms-backend/controllers/signUp");

//app using middlewares
app.use(express.json());
app.use(cors());


// routing middleware


app.use("/sendOtp", sendOtpService);
app.use("/compareOtp", compareOtp);





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
