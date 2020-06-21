const express = require("express");
const router = express.Router();
const Campground = require("../models/campground");
const middleware = require("../middleware");

//index - show all campgrounds
router.get("/", function(req, res){
    //get all campgrounds
    Campground.find({}, function(err, allCampgrounds){
        if(err){
            console.log(err);
        }
        else{
    res.render("campgrounds/index", {campgrounds: allCampgrounds, currentUser: req.user});
            
        }
    })
});

//create route
router.post("/", middleware.isLoggedIn, function(req, res){
    const name = req.body.name;
    const price = req.body.price;
    const image = req.body.image;
    const description = req.body.description;
    const author = {
        id: req.user._id,
        username: req.user.username
    }
    const newCampground = {name: name, image: image, description: description, author: author};
    
    //create new campground and save to db
    Campground.create(newCampground, function(err, newlyCreated){
        if(err){
            console.log(err);
        } else{
            res.redirect("/campgrounds");
        }
    })

});

//new
router.get("/new", middleware.isLoggedIn, function(req, res){
    res.render("campgrounds/new");
});

//show route
router.get("/:id", function(req, res){
    Campground.findById(req.params.id).populate("comments").exec(function(err, foundCampground){
        if(err){
            console.log(err);
        }
        else{
            console.log(foundCampground);
            res.render("campgrounds/show", {campground: foundCampground});
        }
    });
    
});

//edit 
router.get("/:id/edit", middleware.checkCampgroundOwnership, function(req, res){
    Campground.findById(req.params.id, function(err, foundCampground){
        res.render("campgrounds/edit", {campground: foundCampground});
    });
});


//update - where form submits
router.put("/:id", middleware.checkCampgroundOwnership, function(req, res){
    //find and update correct camp
    Campground.findByIdAndUpdate(req.params.id, req.body.campground, function(err, updatedCampground){
        if(err){
            res.redirect("/campgrounds");
        }
        else{
            res.redirect("/campgrounds/" + req.params.id);
        }
    })
    //redirect to show page
})

//destroy route
router.delete("/:id", middleware.checkCampgroundOwnership, async(req, res) => {
    try {
      let foundCampground = await Campground.findById(req.params.id);
      await foundCampground.remove();
      res.redirect("/campgrounds");
    } catch (error) {
      console.log(error.message);
      res.redirect("/campgrounds");
    }
  });


module.exports = router;