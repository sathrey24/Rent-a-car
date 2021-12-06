const mongoCollections = require('../config/mongoCollections');
const requests = mongoCollections.requests;
const cars = mongoCollections.cars
const users = mongoCollections.users
let { ObjectId } = require('mongodb');
const data = require('./')

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
        const usersCollection = await users()
        try{
            await usersCollection.updateOne({ _id: ObjectId(userId) }, { $set: { requestPending: true } })
        }catch (e){
            throw e
        }
        if (insertInfo.insertedCount === 0){
            throw "Internal Server Error";
        } 
        else {
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
        const requestsList = await requestCollection.find({userId: userId}).toArray()
        return requestsList;
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
        let req = await this.getRequest(id)
        let carId = req.carId
        let userId = req.userId
        const updateInfo = await requestCollection.updateOne({ _id: id },
          { $set: updateRequest });
        if (updateInfo.modifiedCount === 0){
            throw "Internal Server Error"
        } 
        const carCollection = await cars()
        const updateAvailability = await carCollection.updateOne({ _id: ObjectId(carId) }, { $set: { availability: false } })
        const updateRented = await carCollection.updateOne({ _id: ObjectId(carId) }, { $set: { rented: true } })
        const updateRentedby = await carCollection.updateOne({ _id: ObjectId(carId) }, { $set: { rentedBy: userId } })
        if (updateRented.modifiedCount === 0){
            throw "Internal Server Error"
        } 
        if (updateAvailability.modifiedCount === 0){
            throw "Internal Server Error"
        } 
        if (updateRentedby.modifiedCount === 0){
            throw "Internal Server Error"
        } 
        const req_array = await this.getAllRequestsbByID(userId);
        let multirequest = false;
        for(i = 0; i < req_array.length; i++){
            if (!req_array[i].hasOwnProperty('approved')){
                multirequest = true
                break;
            }
        }
        if (!multirequest){
            const usersCollection = await users()
            try{
                await usersCollection.updateOne({ _id: ObjectId(userId) }, { $set: { requestPending: false } })
            }catch (e){
                throw e
            }
        }
        else {
            return {requestUpdated: true}
        }
    }
}