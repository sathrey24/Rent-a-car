const mongoCollections = require('../config/mongoCollections');
const cars = mongoCollections.cars;
let { ObjectId } = require('mongodb');

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

    },
    async getAvailableCars(){
        const carCollection = await cars()
        const carList = await carCollection.find({}).toArray();
        let availableCars = []
        for (i = 0; i < carList.length; i++){
          if (carList[i]['rented'] === false){
            availableCars.push(carList[i])
          }
        }
        return availableCars
      },
    
    async getCar(id){
      const carCollection = await cars()
      let parsedId = ObjectId(id)
      const car = await carCollection.findOne({_id: parsedId})
      if (car === null) {throw "no car with that id"}
      return car
    }
};