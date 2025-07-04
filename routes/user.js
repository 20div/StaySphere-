const express = require("express");
const router = express.Router();
const User = require ("../modules/user.js");
const  wrapAsync = require("../utils/wrapasync");
const passport = require("passport");
const { saveRedirectUrl } = require("../middleware.js");
const  userController = require("../Controller/user.js");

router.route("/signup")
.get( userController.Rendersignup)
.post( wrapAsync(userController.signup));

router.route("/login")
.get( userController.Renderlogin)
.post(saveRedirectUrl, 
  passport.authenticate("local", {
  failureRedirect:"/login",
  failureFlash:true,
}),
 userController.loginForm);



 router.get("/logout" , userController.logout);

module.exports= router;