const mongoCollections = require('../config/mongoCollections');
const requests = mongoCollections.requests;
let { ObjectId } = require('mongodb');

module.exports = {

    async createRequest(userId, carId){
        if (arguments.length !== 2){throw "Expected userId and carId as arguments"}
        let newRequest = {
            userId: userId,
            carId: carId,
            accepted: false
        }
        const requestCollection = await requests()
        const insertInfo = await requestCollection.insertOne(newRequest);
        if (insertInfo.insertedCount === 0){
            throw "Internal Server Error"
        } else {
            const id = insertInfo.insertedId.toString()
            return {requestInserted: true, requestId: id}
        }
    },

    async getAllRequests(){
        const requestCollection = await requests()
        const requestList = await requestCollection.find({}).toArray();
        return requestList
    },

    async getAllRequestsbByID(userId){
        const requestCollection = await requests()
        const requests = await requestCollection.find({userId: userId}).toArray()
        return requests
    },
      
      async getRequest(id){
        const requestCollection = await requests()
        let parsedId = ObjectId(id);
        const request = await requestCollection.findOne({_id: parsedId})
        if (request === null) {throw "no request with that id"}
        return request
      },
}