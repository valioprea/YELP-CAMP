const express = require('express');
const router = express.Router({mergeParams: true});
const {validateReview, isLoggedIn, isReviewAuthor} = require('../middleware');
const Campground = require('../models/campground');
const Review = require('../models/review')
const reviews = require('../controllers/reviews');


const ExpressError = require('../utils/ExpressError');
const catchAsync = require('../utils/catchAsync');


//ADDING REVIEWS
router.post('/', isLoggedIn, validateReview, catchAsync(reviews.createReview));

//DELETING REVIEWS
router.delete('/:reviewId',isLoggedIn, isReviewAuthor, catchAsync(reviews.deleteReview));

module.exports = router;