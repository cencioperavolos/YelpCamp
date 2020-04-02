var Comment = require("../models/comment");
var Campground = require("../models/campground")

// Autehntication middleware
function isLoggedIn(req, res, next) {
    if (req.isAuthenticated()) {
        return next();
    }
    req.flash("error", "you need to be logged in to do that")
    res.redirect("/login");
}

// CheckComment Owner middleware "authorization"
function checkCommentOwner(req, res, next) {
    if (req.isAuthenticated()) { 
        const id = req.params.idComment;
        Comment.findById(id).then((comment) => {
            if (comment.author.id.equals(req.user.id)) {
                next();
            } else {
                req.flash("error", "You need to be the owner to do that.");
                res.redirect("back");
            }
        }).catch((err) => {
            console.log("kzzz - /comment/:id/edit", err);
            req.flash("error", "Comment not found. Database Error.");
            res.redirect("back");
        })
    } else {
        req.flash("error", "You need to be logged in to do that.");
        res.redirect("back");
    }
}

// CheckCampgroundOwner middleware "authorization"
function checkCampgroundOwner(req, res, next) {
    if (req.isAuthenticated()) {
        const id = req.params.id;
        Campground.findById(id).then((campFound) => {
            if (campFound.author.id.equals(req.user.id)) {
                next();
            } else {
                req.flash("error", "You need to be the owner to do that.");
                res.redirect("back");
            }
        }).catch((err) => {
            console.log("kzzz - /campgorunds/:id/edit", err);
            req.flash("error", "Campground not found. Database Error.");
            res.redirect("back");
        })
    } else {
        req.flash("error", "You need to be logged in to do that.");
        res.redirect("back");
    }
}

var middlewareObj = {
    isLoggedIn: isLoggedIn,
    checkCampgroundOwner: checkCampgroundOwner,
    checkCommentOwner: checkCommentOwner
}

module.exports = middlewareObj