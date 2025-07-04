const express = require("express");
const router = express.Router();
const wrapasync= require('../utils/wrapasync.js'); 
const Listing =require("../modules/listing.js");
const {isLoggedin , isOwner, validateListing} = require("../middleware.js");

const listingcontroller = require("../Controller/listings.js");
const multer  = require('multer')
const {storage} = require("../cloudconfig.js");
const upload = multer({storage })


//index route and create route
router.route("/")
  .get(wrapasync(listingcontroller.index))
  .post(isLoggedin,
   upload.single('listing[image]'),
   validateListing,
  wrapasync(listingcontroller.createListing)
  );
 
 //New Route
router.get("/new", isLoggedin , listingcontroller.renderNewForm);


//show , update and delete route 
router.route("/:id")
.get( wrapasync(listingcontroller.showListing))
.put( isLoggedin,
    isOwner,
    upload.single('listing[image]'),
    validateListing,
    wrapasync(listingcontroller.updateListing))
.delete(isLoggedin,
      isOwner, 
      wrapasync(listingcontroller.deleteListing));      

//Edit Route
router.get("/:id/edit", 
  isLoggedin, 
  isOwner,
  wrapasync(listingcontroller.renderEditform));



module.exports=router;

