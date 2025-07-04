if(process.env.NODE_ENV != "production"){
  require('dotenv').config();
}


const express = require("express");
const app= express()
const mongoose = require("mongoose");
const Listing =require("./modules/listing.js");
const path = require ("path");
const methodOverride = require("method-override");
const ejsMate = require('ejs-mate');
const wrapasync= require('./utils/wrapasync.js'); 
const ExpressError =require("./utils/ExpressError.js");
const session = require('express-session');
const MongoStore = require('connect-mongo');
const flash = require('connect-flash');
const passport = require("passport");
const LocalStrategy = require("passport-local");
const User =require("./modules/user.js");


const {listingScheme , reviewScheme} =  require("./schema.js");
const Review =require("./modules/review.js");
const listingRouter =require("./routes/listing.js");
const reviewRouter = require("./routes/review.js");
const userRouter = require("./routes/user.js");


const dburl = process.env.ATLAS_DBURL;

main()
  .then(() => {
    console.log("connected to DB");
  })
  .catch((err) =>{
    console.log(err);
  });

  async function  main() {
    await mongoose.connect(dburl);

  }

  app.set("view engine", "ejs");
app.set("views", path.join(__dirname, "views"));
app.use(express.urlencoded({ extended: true }));
app.use(methodOverride("_method"));
app.engine('ejs', ejsMate); // Set ejs-mate as the template engine
app.use(express.static(path.join(__dirname , "/public")));
//app.set("view engine", "ejs");
//app.set("views", path.join(__dirname, "views")); 

const store = MongoStore.create({
  mongoUrl: dburl,
  crypto: {
    secret: process.env.SECRET,
  },
  touchAfter: 24 * 3600,
});

store.on("error" , () =>{
   console.log("Error in MONGO SESSION STORE" , err);
});


const sessionOptions = {
    store,
    secret: process.env.SECRET, 
    resave: false,
    saveUninitialized: true,
    cookies :{
    expires:Date.now() + 7 * 24 * 60 * 60 * 1000,
    maxAge: 7 * 24 * 60 * 60 * 1000,
    httpOnly: true,

    }
};

//app.get("/" ,(req , res) => {
 // res.send("Hi , I am a robot");
//});//basic api create



app.use(session(sessionOptions));
app.use(flash());

app.use(passport.initialize());
app.use(passport.session());
passport.use(new LocalStrategy(User.authenticate()));

passport.serializeUser(User.serializeUser());
passport.deserializeUser(User.deserializeUser());

app.use((req, res, next) => {
  res.locals.success = req.flash('success');
  res.locals.error = req.flash('error');
  res.locals.currUser = req.user;
  next();
});


//app.get("/demouser" , async(req,res)=>{
  //let FakeUser = new User({
   // email: "student@gmail.com",
   // username:"delta-student",
  //});

 // let registeredUser = await User.register(FakeUser , "Helloworld");
 // res.send(registeredUser);
//});

app.use("/listings" , listingRouter);
app.use("/listings/:id/reviews", reviewRouter); 
app.use("/", userRouter);





//app.get("/testListing" ,async (req ,res) =>{
    //let sampleListing = new Listing(
       // {
           // title:"My New Villa",
           // description:"By The Beach",
           // price :1200,
           // location: "Calangute Goa",
           // country :"India",
       // }
   // );

   // await sampleListing.save();
   // console.log("sample was saved");
  //  res.send("successful testing");
    
//});



app.all("*", (req ,res ,next) => {
  next(new ExpressError(404 , "Page Not Found !"));
});


app.use((err, req, res, next) => {
  let {statusCode=500 ,message="Something went wrong!"} = err;
  res.status(statusCode).render("error.ejs" ,{ message});
 // res.status(statusCode).send(message);
});
  


app.listen(8080, () => {
    console.log("server is listening to 8080");

});
