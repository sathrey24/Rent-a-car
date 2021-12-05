const express = require('express');
const router = express.Router();
const data = require('../data/')
const mongoCollections = require('../config/mongoCollections');
const reviews = mongoCollections.reviews;


router.get('/:id', async function(req, res)  {
    try{
        var car = await data.cars.getCar(req.params.id)
        const reviewsCollection = await reviews()
        let reviewArray = await reviewsCollection.find({carId: req.params.id}).toArray()
        var car_reviews = []
        for (i = 0; i < reviewArray.length; i++){
            car_reviews.push({text: reviewArray[i].reviewText, rating: reviewArray[i].rating})
        }
    }catch(e){
        res.render('user/error', {error: `<p> ${e} </p>`});
    }
    if(req.session.role === "user"){
        res.render('user/carDetails', {details: car, rev : car_reviews,role:true});
    }
    else{
        res.render('user/carDetails', {details: car, rev : car_reviews});
    }
  });

module.exports = router;