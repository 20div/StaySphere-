const express = require("express");
const router = express.Router({ mergeParams: true });
const wrapasync= require('../utils/wrapasync.js'); 
const ExpressError =require("../utils/ExpressError.js");
const Review = require ("../modules/review.js");
const Listing =require("../modules/listing.js");
const {validateReview, isLoggedin, isReviewAuthor} = require("../middleware.js");

const reviewController = require("../Controller/review.js");


//reviews
  //POST ROUTE
  router.post("/", 
    isLoggedin,
    validateReview,
    wrapasync(reviewController.createReview));

    router.get("/", (req, res) => {
      console.log("Matched review route");
      res.send(`This works. Listing ID is: ${req.params.id}`);
    });
    


    //Delete ROUTE
   //delete review route
   router.delete("/:reviewId", 
    isLoggedin,
    isReviewAuthor,
    wrapasync(reviewController.destroyReview));
 
  module.exports = router;
  