const express = require("express"),
    app = express(),
    bodyParser = require("body-parser"),
    mongoose = require("mongoose"),
    flash = require("connect-flash"),
    passport = require("passport"),
    localStrategy = require("passport-local"),
    expressSession = require("express-session"),
    methodOverride = require("method-override"),
    Campground = require("./models/campground"),
    Comment = require("./models/comment"),
    User = require("./models/user")
    seedDb = require("./seeds");

// requiring routes
var commentRoutes = require("./routes/comments"),
    campgroundRoutes = require("./routes/campgrounds"),
    indexRoutes = require("./routes/index");

mongoose.connect('mongodb://localhost/yelp_camp',
    { useNewUrlParser: true, useUnifiedTopology: true });
app.use(bodyParser.urlencoded({ extended: true }));
app.set("view engine", "ejs");
app.use(express.static(__dirname + "/public"));
app.use(methodOverride("_method"));
app.use(flash())
// seedDb(); // crea qualche esempio

// PASSPORT CONFIGURATION
app.use(expressSession({
    secret: "checacchio_disegreto",
    resave: false,
    saveUninitialized: false
}))
app.use(passport.initialize());
app.use(passport.session());
passport.use(new localStrategy(User.authenticate()))
passport.serializeUser(User.serializeUser());
passport.deserializeUser(User.deserializeUser());

//POST PASSPORT CONFIGURATION
// Add all responses varaible currentUser
app.use(function(req, res, next){
    res.locals.currentUser = req.user;
    res.locals.error = req.flash(("error"));
    res.locals.success = req.flash(("success"));
    next();
})

app.use("/", indexRoutes);
app.use("/campgrounds", campgroundRoutes);
app.use( "/campgrounds/:id/comments", commentRoutes);

var port = process.env.PORT || 80
app.listen(port, function () {
    console.log("YelpCamp express server listening on port 80!");
}) 