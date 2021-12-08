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
            reviewsGiven: []
        }
        const carCollection = await cars()
        const insertInfo = await carCollection.insertOne(newCar);
        if (insertInfo.insertedCount === 0){
            throw "Internal Server Error"
        } else {
            const id = insertInfo.insertedId.toString()
            return {carInserted: true, carId: id}
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

    async getAllCars(){
      const carCollection = await cars()
      const carList = await carCollection.find({}).toArray();
      return carList
  },
    
    async getCar(id){
      const carCollection = await cars()
      let parsedId = ObjectId(id);
      const car = await carCollection.findOne({_id: parsedId})
      if (car === null) {throw "no car with that id"}
      return car
    },

    async remove(id) {
      var id = ObjectId(id);
      const carCollection = await cars()
      const deletionInfo = await carCollection.deleteOne({ _id: id });
      if (deletionInfo.deletedCount === 0) {
        throw "Could not delete car";
      }
      return "Car deleted successfully";
    },

    async update(id,model, type, color, numberDoors, seatingCapacity, hourlyRate, availability, engineType){
      id = ObjectId(id);
      let newCar = {
          model: model,
          type: type,
          color: color,
          numberDoors: numberDoors,
          seatingCapacity: seatingCapacity,
          hourlyRate: hourlyRate,
          availability: availability,
          engineType: engineType
      }
      const carCollection = await cars()
      const updateInfo = await carCollection.updateOne({ _id: id },
        { $set: newCar });
      if (updateInfo.insertedCount === 0){
          throw "Internal Server Error"
      } else {
          return {carInserted: true}
      }
  }
};