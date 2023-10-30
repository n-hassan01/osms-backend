require("dotenv").config();
const express = require("express");
const cors = require("cors");
const app = express();

//routing api for users
const SignupService = require("../osms-backend/Controllers/signupService");
const SendOtpService = require("./controllers/sendOtpService");
const CompareOtpService = require("./Controllers/compareOtpService");
const StoreOtpService = require("../osms-backend/Controllers/storeOtpService");
const GetOtpService = require("./Controllers/getOtpService");
const DeleteOtpService = require("./Controllers/deleteOtpService");

//routing api for admin
const AddHrLocationsAll = require("./Controllers/AdminPanel/addHrLocationsAll");
const AddUnitMeasureService = require("./Controllers/AdminPanel/addUnitMeasuresService");
const GetHrLocationAll = require("./Controllers/AdminPanel/getHrLocationsAll");
const UpdateHrLocationAll = require("../osms-backend/Controllers/AdminPanel/updateHrLocationsAll");
const DeleteHrLocationAll = require("../osms-backend/Controllers/AdminPanel/deleteHrLocations");

//app using middlewares
app.use(express.json());
app.use(cors());

// routing middleware for user
app.use("/signup", SignupService);
app.use("/send-otp", SendOtpService);
app.use("/compare-otp", CompareOtpService);
app.use("/store-otp", StoreOtpService);
app.use("/get-otp", GetOtpService);
app.use("/delete-otp", DeleteOtpService);

// routing middleware for admin
app.use("/add-unit-measure", AddUnitMeasureService);
app.use("/add-hr-locations-all", AddHrLocationsAll);
app.use("/get-hr-locations-all", GetHrLocationAll);
app.use("/update-hr-locations-all", UpdateHrLocationAll);
app.use("/delete-hr-locations-all", DeleteHrLocationAll);

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

const port = process.env.PORT || 5001;
app.listen(port, () => console.log(`Listening on port ${port}...`));
