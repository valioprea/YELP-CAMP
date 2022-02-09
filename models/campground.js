//we need to tie ourselves with the middleware mongoose
const mongoose = require('mongoose');
const Review = require('./review')
const Schema = mongoose.Schema;

const CampgroundSchema = new Schema({
   title: String,
   image: String,
   price: Number,
   description: String,
   location: String,
   author: {
      type: Schema.Types.ObjectId,
      ref: 'User'
   },
   reviews: [
      {
         type: Schema.Types.ObjectId,
         ref: 'Review'
      }
   ]
});

//deleting the reviews associated with the campground when you delete a campground
CampgroundSchema.post('findOneAndDelete', async function (doc) {
   if(doc){
      await Review.deleteMany({
         _id: {
            $in: doc.reviews
         }
      })
   }
})

//we need to export this in order to be able to use it 
module.exports = mongoose.model('Campground', CampgroundSchema);