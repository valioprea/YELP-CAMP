// if(process.env.NODE_ENV !== "production") {
//    require('dotenv').config();
// }

// require('dotenv').config();
const express = require('express');
//we need to require the path to use for the views directory
const path = require('path');
//i need to use ejs-mate useful for templating
const ejsMate = require('ejs-mate');
const session = require('express-session');
const mongoose = require('mongoose');
const methodOverride = require('method-override');
const Campground = require('./models/campground');
const { update } = require('./models/campground');
const flash = require('connect-flash');
const ExpressError = require('./utils/ExpressError');
const Joi = require('joi');
// const {campgroundSchema, reviewSchema} = require('./schemas.js');
// const Review = require('./models/review')

const passport = require('passport');
const LocalStrategy = require('passport-local');
const User = require('./models/user');

const userRoutes = require('./routes/users');
const campgroundRoutes = require('./routes/campgrounds');
const reviewRoutes = require('./routes/reviews');


const mongoSanitize = require('express-mongo-sanitize');

//connecting mongoose with mongodb
mongoose.connect('mongodb://localhost:27017/yelp-camp');

const db = mongoose.connection;
db.on("error", console.error.bind(console, "connection error:"));
db.once("open", () => {
   console.log("The database has been connected");
})

const app = express();

//I can view ejs files
app.engine('ejs', ejsMate);
app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, 'views'));

//We need to use in the future a body parser, therefore express needs to USE it
app.use(express.urlencoded({ extended: true }));
//To allow other types of requests on forms other than POST
app.use(methodOverride('_method'));
//Serve the public folder! - with javascripts and stylesheets and stuff
app.use(express.static(path.join(__dirname, 'public')));
app.use(mongoSanitize());

//Session stuff
const sessionConfig = {
   name: 'session_cookie',
   secret: 'thisshouldbeabettersecret',
   resave: false,
   saveUninitialized: true,
   cookie: {
      httpOnly: true,
      // secure: true,  //this is only for when I deploy, to make site secure with https
      expires: Date.now() + 1000*60*60*24*7,
      maxAge: 1000*60*60*24*7
   }
}
app.use(session(sessionConfig));
//Flash stuff
app.use(flash());

//For authentication. This passport session must be used after session Config (from docs)
app.use(passport.initialize());
app.use(passport.session());
passport.use(new LocalStrategy(User.authenticate())); //hello, we would like to use the local stratefy

passport.serializeUser(User.serializeUser());     //store user in session
passport.deserializeUser(User.deserializeUser());  //unstore user in session

//Middleware for flash on every single request
app.use((req,res,next) => {
   res.locals.currentUser = req.user;
   res.locals.success = req.flash('success');
   res.locals.error = req.flash('error');
   next();
})


//Use these two routes
app.use('/', userRoutes);
app.use('/campgrounds', campgroundRoutes);
app.use('/campgrounds/:id/reviews', reviewRoutes);

//Shows home
app.get('/', (req, res) => {
   res.render('home')
});

app.all('*', (req,res,next) =>{
   next(new ExpressError('Page not found...', 404))
})

app.use((err, req, res, next) => {
   const {statusCode = 500} = err;
   if(!err.message) err.message = 'oh no, something went wrong!';
   res.status(statusCode).render('error', {err})
})

//Server is awake
app.listen(3000, () => {
   console.log('I am serving, on port 3000')
});