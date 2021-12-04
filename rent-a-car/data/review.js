const mongoCollections = require('../config/mongoCollections');
const reviews = mongoCollections.reviews;
const cars = mongoCollections.cars
const users = mongoCollections.users
let { ObjectId } = require('mongodb');

module.exports = {
    async createReview(userId, carId, reviewText, rating){
        if (arguments.length !=4) {throw "expected 4 arguments: userId, carId, reviewText, and rating "}
        const reviewsCollection = await reviews()
        let newReview = {
            userId: userId,
            carId: carId,
            reviewText: reviewText,
            rating: rating
        }
        const insertInfo = await reviewsCollection.insertOne(newReview)
        if (insertInfo.insertedCount === 0) throw 'Could not add review';
        const id = insertInfo.insertedId.toString()
        const carCollection = await cars()
        await carCollection.updateOne(
            { _id: ObjectId(carId) },
            { $addToSet: { reviewsGiven: id }  
        });
        const usersCollection = await users()
        await usersCollection.updateOne(
            { _id: ObjectId(userId) },
            { $addToSet: { reviewsGiven: id }  
        });
        let reviewArray = await reviewsCollection.find({carId: carId}).toArray()
        let sum = 0;
        let avg = 0;
        for (i = 0; i < reviewArray.length; i++){
            sum += reviewArray[i].rating
        }
        avg = sum / reviewArray.length
        avg = Math.round(avg * 100) / 100
        await carCollection.updateOne(
            {_id: ObjectId(carId)},
            {$set: {overallRating: avg}
        });
        return {reviewInserted: true, reviewId: id }
    },
    async getReview(id){
        const reviewsCollection = await reviews()
        let parsedId = ObjectId(id);
        const review = await reviewsCollection.findOne({_id: parsedId})
        if (review === null) {throw "no review with that id"}
        return review
      },

};