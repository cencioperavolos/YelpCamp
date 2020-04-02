var express = require("express");
var Campground = require("../models/campground");
var Comment = require("../models/comment");
var middleware = require("../middleware") // /index sottointeso
var router = express.Router({ mergeParams: true }); //to access parent route parameters

// ****************************************
// COMMENTS ROUTES
// ****************************************

// NEW comment for campground (SHOW  comment form)
router.get("/new", middleware.isLoggedIn, (req, res) => {
    const id = req.params.id;
    Campground.findById(id).then((campgoruund) => {
        res.render("comments/new", {
            campground: campgoruund
        })
    }).catch((err) => {
        console.log("kzzz", err) 
    })
})

// CREATE comment and add to db
router.post("/", middleware.isLoggedIn, (req, res) => {
    Campground.findById(req.params.id).then((camp) => {
        const comment = req.body.comment;
        Comment.create(comment).then((comm) => {
            comm.author.id = req.user._id;
            comm.author.username = req.user.username;
            comm.save();
            camp.comments.push(comm);
            camp.save().then((object) => {
                req.flash("Success", "Succesfully added comment.");
                res.redirect("/campgrounds/" + object._id);
            })
        })
    }).catch((err) => {
        req.flash("error", "Something went wrong!");
        console.log("kzzz", err);
        res.redirect("/campgrounds/new")
    })
})

// UPDATE comment (SHOW comment form)
router.get("/:idComment/edit", middleware.checkCommentOwner,(req, res) => {
    const id = req.params.idComment;
    Comment.findById(id).then((comment) => {
        Campground.findById(req.params.id).then((camp) => {
            res.render("comments/edit", {
                comment: comment,
                campground: camp
            })
        })
    }).catch((err) => {
        console.log("KZZ - update comment", err);
        res.redirect("back");
    })
})

// UPDATE edit comment and save to database
router.put("/:idComment", middleware.checkCommentOwner, (req, res) => {
    Comment.findByIdAndUpdate(req.params.idComment, {
        text: req.body.comment.text
    }).then((comment) => {
        res.redirect("/campgrounds/" + req.params.id);
    }).catch((err) => {
        console.log("kz edit comment", err);
        res.redirect("back");
    })
}) 

// DELETE comment
router.delete("/:idComment", middleware.checkCommentOwner, (req, res) => {
    Comment.findByIdAndDelete(req.params.idComment).then((c) => {
        req.flash("Success", "Succesfully removed comment.");
        res.redirect(("/campgrounds/" + req.params.id));
    }).catch((err) => {
        console.log("Kzz -deleting comment", err);
    })
})

module.exports = router;