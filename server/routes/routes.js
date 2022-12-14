const express = require("express");
const multer = require("multer");
const verifyToken = require("../config/verifyToken");

const UserController = require("../controllers/UserController");
const EventController = require("../controllers/EventController");
const DashboardController = require("../controllers/DashboardController");
const LoginController = require("../controllers/LoginController");
const RegistrationController = require("../controllers/RegistrationController");
const ApprovalController = require("../controllers/ApprovalController");
const RejectionController = require("../controllers/RejectionController");
const uploadConfig = require("../config/upload");

const routes  = express.Router();
const upload = multer(uploadConfig);

routes.get('/',(req,res)=>{
    res.send('Hello from express');
})

//TODO subscribe Controller

//TODO Registration Rejection

//Registration
routes.get("/registration/requests",verifyToken,RegistrationController.getAllRequests);
routes.get("/registration/:registration_id",RegistrationController.getRegistration);
routes.post("/registration/:eventId",RegistrationController.create);
routes.post("/registration/:registration_id/approvals",verifyToken,ApprovalController.approval);
routes.post("/registration/:registration_id/rejections",verifyToken,RejectionController.rejection);

//Login 
routes.post("/login",LoginController.Store);

//DashBoard
routes.get("/dashboard",verifyToken,DashboardController.getAllevents);
routes.get("/dashboard/myevent",verifyToken,DashboardController.getAllUserEvents);
routes.get("/event/:eventId",verifyToken,DashboardController.getEventById);
routes.get("/dashboard/:sport",verifyToken,DashboardController.getAlleventById);

//Event
routes.delete("/event/:eventId",verifyToken,EventController.Delete);
routes.post("/event",upload.single('thumbnail'),verifyToken,EventController.createEvent);

//User
routes.post("/user/register",UserController.createUser);
routes.get("/user/users",UserController.getAllUsers);
routes.get("/user/:userId",UserController.getUserById);

module.exports = routes;