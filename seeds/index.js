//connect to mongoose and is going to connect to the model
const cities = require('./cities');
const mongoose = require('mongoose');
const {places, descriptors} = require('./seedHelpers');
const Campground = require('../models/campground');

//connecting mongoose with mongodb
mongoose.connect('mongodb://localhost:27017/yelp-camp');

const db = mongoose.connection;
db.on("error", console.error.bind(console, "connection error:"));
db.once("open", () => {
   console.log("The database has been connected");
});


const sample = array => array[Math.floor(Math.random()*array.length)];

const seedDB = async() => {
   await Campground.deleteMany({});
   for(let i = 0; i<50; i++){
      const random1000 = Math.floor(Math.random() *1000);
      const price = Math.floor(Math.random() * 20) + 10;
      const camp = new Campground({
         author: '62013abe775c925a839f9e92',
         location: `${cities[random1000].city}, ${cities[random1000].state}`,
         title: `${sample(descriptors)} ${sample(places)}`,
         image: 'https://source.unsplash.com/collection/483251',
         description: 'Lorem ipsum dolor sit amet, consectetur adipisicing elit. Veritatis voluptate, laudantium ad libero eligendi aspernatur ut dolorum adipisci cupiditate impedit architecto perspiciatis, saepe illo sit labore, voluptas rerum tenetur autem.',
         price
      })
      await camp.save();
   }
}

seedDB().then( () => {
   mongoose.connection.close();
})