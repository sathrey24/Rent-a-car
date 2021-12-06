const mongoCollections = require('../config/mongoCollections');
const requests = mongoCollections.requests;
let { ObjectId } = require('mongodb');
const { request } = require('express');

module.exports = {

    async createRequest(userId, carId,fromDate,toDate,timePeriod){
        if (arguments.length !== 5){throw "Expected userId and carId as arguments"}
        let newRequest = {
            userId:userId,
            carId:carId,
            fromDate:fromDate,
            toDate:toDate,
            timePeriod:timePeriod
        };
        const requestCollection = await requests();
        const insertInfo = await requestCollection.insertOne(newRequest);
        if (insertInfo.insertedCount === 0){
            throw "Internal Server Error";
        } else {
            const id = insertInfo.insertedId.toString();
            return {requestInserted: true, requestId: id};
        }
    },

    async getAllRequests(){
        let pendingRequestList=[];
        const requestCollection = await requests();
        const requestList = await requestCollection.find({}).toArray();
        for(let i=0;i<requestList.length;i++){
            if(requestList[i].approved === undefined){
                pendingRequestList.push(requestList[i]);
            }
        }
        return pendingRequestList;
    },

    async getAllRequestsbByID(userId){
        const requestCollection = await requests()
        const requests = await requestCollection.find({userId: userId}).toArray()
        return requests;
    },
      
    async getRequest(id){
        const requestCollection = await requests();
        let parsedId = ObjectId(id);
        const request = await requestCollection.findOne({_id: parsedId});
        if (request === null) {throw "no request with that id"};
        return request;
    },

    async approveRequest(id,flag){
        id = ObjectId(id);
        let updateRequest = {
            approved : flag
        }
        const requestCollection = await requests()
        const updateInfo = await requestCollection.updateOne({ _id: id },
          { $set: updateRequest });
        if (updateInfo.insertedCount === 0){
            throw "Internal Server Error"
        } else {
            return {requestUpdated: true}
        }
    }
}