const mongoCollections = require('../config/mongoCollections');
const cars = mongoCollections.cars;

module.exports = {
    async createCar(model, type, color, numberDoors, seatingCapacity, hourlyRate, availability, engineType){
        let newCar = {
            model: model,
            type: type,
            color: color,
            numberDoors: numberDoors,
            seatingCapacity: seatingCapacity,
            hourlyRate: hourlyRate,
            availability: availability,
            overallRating: 0,
            engineType: engineType,
            reviewsGiven: [],
            rented: false,
            rentedBy: "Currrently not being rented by anyone"
        }
        const carCollection = await cars()
        const insertInfo = await carCollection.insertOne(newCar);
        if (insertInfo.insertedCount === 0){
            throw "Internal Server Error"
        } else {
            return {carInserted: true}
        }

    }
};