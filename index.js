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
const AddHrLocationsAll = require("./Controllers/AdminPanel/addHrLocationsService");
const AddUnitMeasureService = require("./Controllers/AdminPanel/addUnitMeasuresService");
const GetHrLocationAll = require("./Controllers/AdminPanel/getHrLocationsService");
const UpdateHrLocationAll = require("./Controllers/AdminPanel/updateHrLocationsService");
const DeleteHrLocationAll = require("./Controllers/AdminPanel/deleteHrLocationsService");
const GetUnitMeasureService = require("./Controllers/AdminPanel/getUnitMeasureService");
const DisableUnitMeasureService = require("./Controllers/AdminPanel/disableUnitMeasureService");
const UpdateUnitMeasureService = require("./Controllers/AdminPanel/updateUnitMeasureService");
const AddHrOrganizationUnits = require("./Controllers/AdminPanel/addHrOrganizationUnitsService");
const GetHrOrganizationUnits = require("./Controllers/AdminPanel/getHrOrganizationUnitsService");
const UpdateHrOrganizationUnits = require("./Controllers/AdminPanel/updateHrOrganizationUnitsService");
const DeleteHrOrganizationUnits = require("./Controllers/AdminPanel/deleteHrOrganizationUnitsService");

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
app.use("/add-hr-locations-all", AddHrLocationsAll);
app.use("/get-hr-locations-all", GetHrLocationAll);
app.use("/update-hr-locations-all", UpdateHrLocationAll);
app.use("/delete-hr-locations-all", DeleteHrLocationAll);
app.use("/add-unit-measure", AddUnitMeasureService);
app.use("/get-unit-measure", GetUnitMeasureService);
app.use("/disable-unit-measure", DisableUnitMeasureService);
app.use("/update-unit-measure", UpdateUnitMeasureService);
app.use("/add-hr-organization-units", AddHrOrganizationUnits);
app.use("/get-hr-organization-units", GetHrOrganizationUnits);
app.use("/update-hr-organization-units", UpdateHrOrganizationUnits);
app.use("/delete-hr-organization-units", DeleteHrOrganizationUnits);

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
