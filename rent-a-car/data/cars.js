const mongoCollections = require('../config/mongoCollections');
const cars = mongoCollections.cars;
let { ObjectId } = require('mongodb');

module.exports = {
    async createCar(model, type, color, numberDoors, seatingCapacity, hourlyRate, availability, engineType){
      if (!model || !type || !color || !numberDoors || !seatingCapacity || !hourlyRate || !availability || !engineType) {
        throw "All fields must be present";
      }
        let newCar = {
            model: model.toUpperCase(),
            type: type.toUpperCase(),
            color: color.toUpperCase(),
            numberDoors: numberDoors,
            seatingCapacity: seatingCapacity,
            hourlyRate: hourlyRate,
            availability: availability.toUpperCase(),
            overallRating: 0,
            engineType: engineType.toUpperCase(),
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
          if (carList[i]['availability'] === "YES"){
            availableCars.push(carList[i])
          }
        }
        return availableCars;
    },

    async getAllCars(){
      const carCollection = await cars()
      const carList = await carCollection.find({}).toArray();
      return carList
  },
    
    async getCar(id){
      if (!id) {
        throw "Id field must be present";
      }
      const carCollection = await cars()
      let parsedId = ObjectId(id);
      const car = await carCollection.findOne({_id: parsedId})
      if (car === null) {throw "No car with that id"}
      return car
    },

    async remove(id) {
      if (!id) {
        throw "Id field must be present";
      }
      var id = ObjectId(id);
      const carCollection = await cars()
      const deletionInfo = await carCollection.deleteOne({ _id: id });
      if (deletionInfo.deletedCount === 0) {
        throw "Could not delete car";
      }
      return "Car deleted successfully";
    },

    async update(id,model, type, color, numberDoors, seatingCapacity, hourlyRate, availability, engineType){
      if (!model || !type || !color || !numberDoors || !seatingCapacity || !hourlyRate || !availability || !engineType) {
        throw "All fields must be present";
      }
      id = ObjectId(id);
      let newCar = {
          model: model.toUpperCase(),
          type: type.toUpperCase(),
          color: color.toUpperCase(),
          numberDoors: numberDoors,
          seatingCapacity: seatingCapacity,
          hourlyRate: hourlyRate,
          availability: availability.toUpperCase(),
          engineType: engineType.toUpperCase()
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