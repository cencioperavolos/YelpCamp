var express = require("express");
var passport = require("passport");
var User = require("../models/user");

var router = express.Router();

// LANDING page
router.get("/", function (req, res) {
    res.render("landing")
})

// ****************************************
// AUTH ROUTES
// ****************************************

// SHOW register form
router.get("/register", (req, res) => {
    res.render("register.ejs") 
})

// CREATE new user
router.post("/register", (req, res) =>{
    User.register(new User({username: req.body.username}),
        req.body.password,
        function(err, user){
            if(err){
                console.log("kzzz - register problem", err);
                req.flash("error", "Error: " +  err.message);
                return res.redirect("/register")
            }
            passport.authenticate("local")(req, res, function(){
                req.flash("success", "Welcome to YelpCamp " + user.username)
                res.redirect("/campgrounds");
        })
    })
})

// SHOW login form
router.get("/login", (req, res) => { 
    res.render("login")
})

//HANDLE user login
router.post("/login",
    passport.authenticate("local", {
        successRedirect: "/campgrounds",
        successFlash: 'Welcome.',
        failureRedirect: "/login",
        failureFlash: 'Invalid username or password.' 
    }),
    (req, res) => { }
)

//HANDLE user logout
router.get("/logout", (req, res) => {
    req.logout();
    req.flash("success", "Logged you out!!");
    res.redirect("/")
})

module.exports = router;