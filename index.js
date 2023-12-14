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

//routing api for sales order module
const AddSalesOrderService = require("./Controllers/SalesOrder/addSalesOrderHeaderService");
const GetSalesOrderService = require("./Controllers/SalesOrder/getSalesOrderHeaderService");
const DeleteSalesOrderService = require("./Controllers/SalesOrder/deleteSalesOrderService");
const UpdateSalesOrderHeaderService = require("./Controllers/SalesOrder/updateSalesOrderHeaderService");
const SalesOrderLineService = require("./Controllers/SalesOrder/salesOrderLineService");
const SoApprovalService = require("./Controllers/SalesOrder/soApprovalService");
const WfNotificationView = require("./Controllers/SalesOrder/wfNotificationViewService");
const CreateSalesOrderNumberSevice = require("./Controllers/SalesOrder/getSalesOrderNumberService");

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
const GetPerMtlTransactionTypesService = require("./Controllers/AdminPanel/getPerMtlTransactionTypesService");
const GetMtlMaterialTransactionsService = require("./Controllers/AdminPanel/getMtlMaterialTransactionsService");
const GetPerAllPeoplesService = require("./Controllers/AdminPanel/getPerAllPeoplesService");
const AddPerAllPeoplesService = require("./Controllers/AdminPanel/addPerAllPeoplesService");
const UpdatePerAllPeoplesService = require("./Controllers/AdminPanel/updatePerAllPeoplesService");
const GetperPerAllPeoplesService = require("./Controllers/AdminPanel/getperPerAllPeoplesService");
const DeletePerAllPeoplesService = require("./Controllers/AdminPanel/deletePerAllPeoplesService");
const GetDataForFndUserService = require("./Controllers/AdminPanel/getDataForFndUserService");
const AddFndUserService = require("./Controllers/AdminPanel/addFndUserService");
const GetFndUserService = require("./Controllers/AdminPanel/getFndUserService");
const UpdateFndUserService = require("./Controllers/AdminPanel/updateFndUserService");
const GetPerFndUserService = require("./Controllers/AdminPanel/getPerFndUserService");
const DeleteFndUserService = require("./Controllers/AdminPanel/deleteFndUserService");
const GetMainSystemMenuService = require("./Controllers/AdminPanel/getMainSystemMenuService");
const AddMainSystemMenuService = require("./Controllers/AdminPanel/addMainSystemMenuService");
const GetperMainSystemMenuService = require("./Controllers/AdminPanel/getperMainSystemMenuService");
const UpdateMainSystemMenuService = require("./Controllers/AdminPanel/UpdateMainSystemMenuService");
const DeleteMainSystemMenuService = require("./Controllers/AdminPanel/deleteMainSystemMenuService");
const GetMenusService = require("./Controllers/AdminPanel/getMenusService");
const UpdateMenusService = require("./Controllers/AdminPanel/updateMenusService");
const DeleteMenusService = require("./Controllers/AdminPanel/deleteMenusService");
const GetPerMenusService = require("./Controllers/AdminPanel/getPerMenusService");
const AddSubMenuService = require("./Controllers/AdminPanel/addSubMenuService");
const GetSubMenuService = require("./Controllers/AdminPanel/getSubMenuService");
const GetPerSubMenuService = require("./Controllers/AdminPanel/getPerSubMenuService");
const UpdateSubMenuService = require("./Controllers/AdminPanel/updateSubMenuService");
const DeleteSubMenuService = require("./Controllers/AdminPanel/deleteSubMenuService");
const GetMenuIdService = require("./Controllers/AdminPanel/getMenuIdService");
const AddUserAssignService = require("./Controllers/AdminPanel/addUserAssignService");
const GetHrLocationsIdService = require("./Controllers/AdminPanel/getHrLocationsIdService");
const AddPoActionHistory = require("./Controllers/AdminPanel/addPoActionHistory");
const UpdatePoActionHistory = require ("./Controllers/AdminPanel/updatePoActionHistory.js");
const GetPoActionHistory = require ("./Controllers/AdminPanel/getPoActionHistory");
const DeletePoActionHistory = require ("./Controllers/AdminPanel/deletePoActionHistory");
const AddWfNotifications = require("./Controllers/AdminPanel/addWfNotifications.js");
const UpdateWfNotifications = require("./Controllers/AdminPanel/updateWfNotifications.js");
const GetWfNotifications = require ("./Controllers/AdminPanel/getWfNotifications.js");
const DeleteWfNotifications = require("./Controllers/AdminPanel/deleteWfNotifications.js");
const GetOrderNumberService = require("./Controllers/AdminPanel/getOrderNumberService.js");

// middlewares api
const AuthGuard = require("./middlewares/authGuard");
const LoginToken = require("./middlewares/getLoginTokenMiddleware");

//app using middlewares
app.use(express.json());
app.use(cors());

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

// routing middleware for sales order module
app.use("/add-sales-order-header", AddSalesOrderService);
app.use("/get-sales-order-header", GetSalesOrderService);
app.use("/delete-sales-order-header", DeleteSalesOrderService);
app.use("/update-sales-order-header", UpdateSalesOrderHeaderService);
app.use("/sales-order-line", SalesOrderLineService);
app.use("/so-approval", SoApprovalService);
app.use("/wf-notification-view", WfNotificationView);
app.use("/create-salesorder-number", CreateSalesOrderNumberSevice);

// routing middleware for admin
app.use("/add-hr-locations-all", AddHrLocationsAll);
app.use("/get-hr-locations-all", GetHrLocationAll);
app.use("/get-hr-locations-id", GetHrLocationsIdService);
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
app.use("/get-per-mtl-transaction-types", GetPerMtlTransactionTypesService);
app.use("/get-mtl-material-transactions", GetMtlMaterialTransactionsService);
app.use("/get-per-all-peoples", GetPerAllPeoplesService);
app.use("/add-per-all-peoples", AddPerAllPeoplesService);
app.use("/update-per-all-peoples", UpdatePerAllPeoplesService);
app.use("/getper-per-all-peoples", GetperPerAllPeoplesService);
app.use("/getdata-for-fnd-user", GetDataForFndUserService);
app.use("/add-fnd-user", AddFndUserService);
app.use("/get-fnd-user", GetFndUserService);
app.use("/update-fnd-user", UpdateFndUserService);
app.use("/get-per-fnd-user", GetPerFndUserService);
app.use("/delete-fnd-user", DeleteFndUserService);
app.use("/get-menu-ids",GetMenuIdService);

///////////////////////// sap 
app.use("/add-po-action-history", AddPoActionHistory);
app.use("/update-po-action-history", UpdatePoActionHistory);
app.use("/get-po-action-history", GetPoActionHistory);
app.use("/delete-po-action-history", DeletePoActionHistory);
app.use("/add-wf-notifications", AddWfNotifications);
app.use("/update-wf-notifications", UpdateWfNotifications);
app.use("/get-wf-notifications", GetWfNotifications);
app.use("/delete-wf-notifications", DeleteWfNotifications);
app.use("/get-order-number",GetOrderNumberService);

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
