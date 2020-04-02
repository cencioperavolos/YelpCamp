var express = require("express");
var router = express.Router();
var Campground = require("../models/campground");
var middleware = require("../middleware"); // /index sottointeso

// INDEX list all campgrounds
router.get("/", function (req, res) {

    Campground.find({}).then((results) => {
        res.render("campgrounds/index", {
            campgrounds: results
        });
    }).catch((error) => {
        console.log("kzzz - /campgrounds", error)
    });
})

// CREATE campground and add to DB
router.post("/", middleware.isLoggedIn, function (req, res) {
    const newCampground = req.body.campground;
    newCampground.author = {
        id: req.user._id,
        username: req.user.username
    }
    Campground.create(newCampground).then((obj) => {
        res.redirect("/campgrounds/" + obj._id);
    }).catch((err) => {
        console.log("kzzz - /campgorunds POST", err);
    })
})

// NEW campground form page
router.get("/new", middleware.isLoggedIn, function (req, res) {
    res.render("campgrounds/new")
})

// SHOW view single specific campground
router.get("/:id", (req, res) => {
    const id = req.params.id;
    Campground.findById(id).populate('comments').exec().then((obj) => {
        res.render("campgrounds/show", {
            campground: obj
        });
    }).catch((err) => {
        console.log("kzzz - /campgorunds/:id", err)
    })
})

// EDIT campground form page
router.get("/:id/edit", middleware.checkCampgroundOwner, (req, res) => {
    Campground.findById(req.params.id).then((campFound) => {
        res.render("campgrounds/edit", {
            campground: campFound
        });
    }) 
})

// UPDATE campground (save to db and show)
router.put("/:id", middleware.checkCampgroundOwner, (req, res) => {
    const id = req.params.id;
    Campground.findByIdAndUpdate(id, req.body.campground).then((camp) => {
        res.redirect("/campgrounds/" + camp._id)
    }).catch((err) => {
        console.log("kzzz - campground edit/put", err);
        res.redirect("/campgrounds/" + camp._id)
    })
})



// DELETE campground
router.delete("/:id", middleware.checkCampgroundOwner, (req, res) => {
    Campground.findByIdAndRemove(req.params.id).then((obj) => {
        console.log("DELETED", obj);
        res.redirect("/campgrounds")
    }).catch((err) => {
        console.log("kzzz-deleting", err)
        res.redirect("/campgrounds")
    })
})

module.exports = router;