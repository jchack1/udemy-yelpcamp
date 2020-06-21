const express = require("express");
const app = express();
const bodyParser = require("body-parser");
const mongoose = require("mongoose");
const dotenv = require("dotenv").config();
const passport = require("passport");
const LocalStrategy = require("passport-local");
const methodOverride = require("method-override");
const flash = require("connect-flash");

const Campground = require("./models/campground");
const Comment = require("./models/comment");
const User = require("./models/user");
const seedDB = require("./seed");

//requiring routes
const commentRoutes = require("./routes/comments");
const campgroundRoutes = require("./routes/campgrounds");
const indexRoutes = require("./routes/index")



//setup
app.use(express.static(__dirname + "/public"));
app.use(bodyParser.urlencoded({extended: true}));
app.set("view engine", "ejs");

//connecting to mongoose
mongoose.connect(process.env.DB_CONNECTION, {
    useUnifiedTopology:true, useNewUrlParser: true
});
const db = mongoose.connection;

db.on("error", console.error.bind(console, "Error connecting to mongoose"));
db.once("open", function(){
      console.log("Connected to the database");
  })


//seed the database on start
//seedDB();


//passport configuration
app.use(require("express-session")({
    secret: "HarleyBear",
    resave: false,
    saveUninitialized: false
}));

app.use(methodOverride("_method"));
app.use(flash());

app.use(passport.initialize());
app.use(passport.session());
passport.use(new LocalStrategy(User.authenticate()));
passport.serializeUser(User.serializeUser());
passport.deserializeUser(User.deserializeUser());

//allows you to use currentUser, the var for req.user, on every page 
app.use(function(req, res, next){
    res.locals.currentUser = req.user;
    res.locals.error = req.flash("error");
    res.locals.success = req.flash("success");

    next();
})

//tells app to use these
//add prefix to make code dry in route files
app.use(indexRoutes);
app.use("/campgrounds/:id/comments", commentRoutes);
app.use("/campgrounds", campgroundRoutes);


//listen to port

const PORT = process.env.PORT || 3000;
app.listen(PORT, function(){
    console.log("Yelpcamp started on post 3000");
});