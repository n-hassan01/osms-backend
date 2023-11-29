require("dotenv").config();
const express = require("express");
const cors = require("cors");
const app = express();

//app using middlewares
app.use(express.json());
app.use(cors());

//routing api for users
const SignupService = require("../osms-backend/Controllers/signupService");
const SendOtpService = require("./controllers/sendOtpService");
const CompareOtpService = require("./Controllers/compareOtpService");
const StoreOtpService = require("../osms-backend/Controllers/storeOtpService");
const GetOtpService = require("./Controllers/getOtpService");
const DeleteOtpService = require("./Controllers/deleteOtpService");
const LoginService = require("./Controllers/loginService");
const GetLoggedInUserDetailsService = require("./Controllers/getLoggedInUserDetails");
const GetUserProfileDetailsService = require("./Controllers/getProfileDetailsService");
const GetUserMenusService = require("./Controllers/getUserMenusService");
const LogoutService = require("./Controllers/logoutService");

//routing api for admin
const AddHrLocationsAll = require("./Controllers/AdminPanel/addHrLocationsService");
const AddUnitMeasureService = require("./Controllers/AdminPanel/addUnitMeasuresService");
const GetHrLocationAll = require("./Controllers/AdminPanel/getHrLocationsService");
const GetPerHrLocationsDetailsService = require("./Controllers/AdminPanel/getPerHrLocationsService");
const UpdateHrLocationAll = require("./Controllers/AdminPanel/updateHrLocationsService");
const DeleteHrLocationAll = require("./Controllers/AdminPanel/deleteHrLocationsService");
const GetUnitMeasureService = require("./Controllers/AdminPanel/getUnitMeasureService");
const DisableUnitMeasureService = require("./Controllers/AdminPanel/disableUnitMeasureService");
const UpdateUnitMeasureService = require("./Controllers/AdminPanel/updateUnitMeasureService");
const AddItemMasterService = require("./Controllers/AdminPanel/addItemMasterService");
const GetItemMasterService = require("./Controllers/AdminPanel/getItemMasterService");
const UpdateItemMasterService = require("./Controllers/AdminPanel/updateItemMasterService");
const DeleteItemMasterService = require("./Controllers/AdminPanel/deleteItemMasterService");
const AddHrOrganizationUnits = require("./Controllers/AdminPanel/addHrOrganizationUnitsService");
const GetHrOrganizationUnits = require("./Controllers/AdminPanel/getHrOrganizationUnitsService");
const UpdateHrOrganizationUnits = require("./Controllers/AdminPanel/updateHrOrganizationUnitsService");
const DeleteHrOrganizationUnits = require("./Controllers/AdminPanel/deleteHrOrganizationUnitsService");
const GetPerHrOrganizationUnits = require("./Controllers/AdminPanel/getPerHrOrganizationUnitsService");
const AddMtlTxnRequestHeadersService = require("./Controllers/AdminPanel/addTxnRequestHeaders");
const GetMtlTxnRequestHeadersService = require("./Controllers/AdminPanel/getTxnRequestHeaders");
const DeleteMtlTxnRequestHeadersService = require("./Controllers/AdminPanel/deleteTxnRequestHeader");
const UpdateMtlTxnRequestHeadersService = require("./Controllers/AdminPanel/updateTxnRequestHeader");
const AddMtlTransactionTypesService = require("./Controllers/AdminPanel/addMtlTransactionTypesService");
const GetMtlTransactionTypesService = require("./Controllers/AdminPanel/getMtlTransactionTypesService");
const DeleteMtlTransactionTypesService = require("./Controllers/AdminPanel/deleteMtlTransactionTypesService");
const UpdateMtlTransactionTypesService = require("./Controllers/AdminPanel/updateMtlTransactionTypesService");
const AddMtlTxnRequestLineService = require("./Controllers/AdminPanel/addTxnRequestLineService");
const DeleteMtlTxnRequestLineService = require("./Controllers/AdminPanel/deleteMtlTxnRequestLineService");

// middlewares api
const AuthGuard = require("./middlewares/authGuard")
const LoginToken = require("./middlewares/getLoginTokenMiddleware")

// routing middleware for user
// authentication and authorization
app.use("/signup", SignupService);
app.use("/send-otp", SendOtpService);
app.use("/compare-otp", CompareOtpService);
app.use("/store-otp", StoreOtpService);
app.use("/get-otp", GetOtpService);
app.use("/delete-otp", DeleteOtpService);
app.use("/login", LoginToken, LoginService);
app.use("/logout", LoginToken, LogoutService);
app.use("/get-menus", GetUserMenusService);
app.use("/loggedin-user", LoginToken, AuthGuard, GetLoggedInUserDetailsService);
app.use("/profile", LoginToken, AuthGuard, GetUserProfileDetailsService);

// routing middleware for admin
app.use("/add-hr-locations-all", AddHrLocationsAll);
app.use("/get-hr-locations-all", GetHrLocationAll);
app.use("/get-per-hr-locations-all", GetPerHrLocationsDetailsService);
app.use("/update-hr-locations-all", UpdateHrLocationAll);
app.use("/delete-hr-locations-all", DeleteHrLocationAll);
app.use("/add-unit-measure", AddUnitMeasureService);
app.use("/get-unit-measure", GetUnitMeasureService);
app.use("/disable-unit-measure", DisableUnitMeasureService);
app.use("/update-unit-measure", UpdateUnitMeasureService);
app.use("/add-item-master", AddItemMasterService);
app.use("/get-item-master", GetItemMasterService);
app.use("/update-item-master", UpdateItemMasterService);
app.use("/delete-item-master", DeleteItemMasterService);
app.use("/add-hr-organization-units", AddHrOrganizationUnits);
app.use("/get-hr-organization-units", GetHrOrganizationUnits);
app.use("/get-per-hr-organization-units", GetPerHrOrganizationUnits);
app.use("/update-hr-organization-units", UpdateHrOrganizationUnits);
app.use("/delete-hr-organization-units", DeleteHrOrganizationUnits);
app.use("/add-txn-header", AddMtlTxnRequestHeadersService);
app.use("/get-txn-header", GetMtlTxnRequestHeadersService);
app.use("/update-txn-header", UpdateMtlTxnRequestHeadersService);
app.use("/delete-txn-header", DeleteMtlTxnRequestHeadersService);
app.use("/add-mtl-transaction-types", AddMtlTransactionTypesService);
app.use("/get-mtl-transaction-types", GetMtlTransactionTypesService);
app.use("/delete-mtl-transaction-types", DeleteMtlTransactionTypesService);
app.use("/update-mtl-transaction-types", UpdateMtlTransactionTypesService);
app.use("/add-txn-line", AddMtlTxnRequestLineService);
app.use("/delete-txn-lines", DeleteMtlTxnRequestLineService);

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
