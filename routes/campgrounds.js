const express = require('express');
const router = express.Router();
const catchAsync = require('../utils/catchAsync');
const Campground = require('../models/campground');
const { isLoggedIn, isAuthor, validateCampground } = require('../middleware');
const campgrounds = require('../controllers/campgrounds');

//We don't really need this, it was a visualizer for initial set up
// app.get('/makecampground', async (req, res) => {
//    const camp = new Campground({title: 'My back yard', description: 'cheap camping'});
//    await camp.save();
//    res.send(camp);
// })

//OLD WAY OF STRUCTURING
//router.get('/', catchAsync(campgrounds.index));
//ORDER MATTERS! this needs to be before the :id route to work
router.get('/new', isLoggedIn, campgrounds.renderNewForm);
//Create a new campground
//router.post('/', isLoggedIn, validateCampground, catchAsync(campgrounds.createCampground));
//SHOW SPECIFIC CAMPGROUND
//router.get('/:id', catchAsync(campgrounds.showCampground));
//route that serves the form for updating a campground
router.get('/:id/edit', isLoggedIn, isAuthor, catchAsync(campgrounds.renderEditForm));
//Update the campground
//router.put('/:id', isLoggedIn, isAuthor, validateCampground, catchAsync(campgrounds.updateCampground));
//Delete the campground
//router.delete('/:id', isLoggedIn, isAuthor, catchAsync(campgrounds.deleteCampground));

//NEW WAY OF STRUCTURING
router.route('/')
   .get(catchAsync(campgrounds.index))
   .post(isLoggedIn, validateCampground, catchAsync(campgrounds.createCampground))

router.route('/:id')
   .get(catchAsync(campgrounds.showCampground))
   .put(isLoggedIn, isAuthor, validateCampground, catchAsync(campgrounds.updateCampground))
   .delete(isLoggedIn, isAuthor, catchAsync(campgrounds.deleteCampground))

module.exports = router;

