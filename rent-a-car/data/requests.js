const mongoCollections = require('../config/mongoCollections');
const requests = mongoCollections.requests;
const cars = mongoCollections.cars;
const users = mongoCollections.users;
let { ObjectId } = require('mongodb');
const data = require('./requests');

module.exports = {

    async createRequest(username, carId, fromDate, toDate, timePeriod, totalCost) {
        if (arguments.length !== 6) { throw "Expected userId and carId as arguments" }
        let newRequest = {
            username: username,
            carId: carId,
            fromDate: fromDate,
            toDate: toDate,
            timePeriod: timePeriod,
            totalCost: totalCost
        };
        const requestCollection = await requests();
        const insertInfo = await requestCollection.insertOne(newRequest);
        const id = insertInfo.insertedId.toString();
        return { requestInserted: true, requestId: id };
    },

    async getAllRequests() {
        let pendingRequestList = [];
        const requestCollection = await requests();
        const requestList = await requestCollection.find({}).toArray();
        for (let i = 0; i < requestList.length; i++) {
            if (requestList[i].approved === undefined) {
                pendingRequestList.push(requestList[i]);
            }
        }
        return pendingRequestList;
    },

    async getAllRequestsByID(username) {
        const requestCollection = await requests()
        const requestsList = await requestCollection.find({ username: username }).toArray();
        let rentedCars = []
        for (i = 0; i < requestsList.length; i++) {
            if (requestsList[i].hasOwnProperty('approved')) {
                if (requestsList[i].approved) {
                    rentedCars.push(requestsList[i]);
                }
            }
        }
        return rentedCars;
    },

    async getAllPendingRequestsByID(username) {
        const requestCollection = await requests()
        const requestsList = await requestCollection.find({ username: username }).toArray();
        let pendingRequest = []
        for (i = 0; i < requestsList.length; i++) {
            if (!requestsList[i].hasOwnProperty('approved')) {
                pendingRequest.push(requestsList[i]);
            }
        }
        return pendingRequest;
    },

    async getRequest(id) {
        const requestCollection = await requests();
        let parsedId;
        if (id) {
            parsedId = ObjectId(id);
        }
        const request = await requestCollection.findOne({ _id: parsedId });
        if (request === null) { throw "no request with that id" };
        return request;
    },

    async approveRequest(id, flag) {
        id = ObjectId(id);
        let updateRequest = {
            approved: flag
        }
        const requestCollection = await requests();
        let req = await this.getRequest(id)
        let carId = req.carId;
        const updateInfo = await requestCollection.updateOne({ _id: id }, { $set: updateRequest });
        if (updateInfo.modifiedCount === 0) {
            throw "Internal Server Error"
        }
        const carCollection = await cars()
        const updateAvailability = await carCollection.updateOne({ _id: ObjectId(carId) }, { $set: { availability: "No" } })
        if (updateAvailability.modifiedCount === 0) {
            throw "Internal Server Error"
        }
    },

    async rejectRequest(id, flag) {
        id = ObjectId(id);
        let updateRequest = {
            approved: flag
        }
        const requestCollection = await requests();
        const updateInfo = await requestCollection.updateOne({ _id: id }, { $set: updateRequest });
        if (updateInfo.modifiedCount === 0) {
            throw "Internal Server Error"
        }
    },

    async getRentedCars() {
        const requestCollection = await requests()
        const requestList = await requestCollection.find({}).toArray();
        let rentedCars = []
        for (i = 0; i < requestList.length; i++) {
            if (requestList[i].hasOwnProperty('approved')) {
                let fromDate = checkDate(new Date(new Date(requestList[i].fromDate).getTime() + 86400000));
                let toDate = checkDate(new Date(new Date(requestList[i].toDate).getTime() + 86400000));
                if (requestList[i].approved && (fromDate || toDate)) {
                    rentedCars.push(requestList[i]);
                }
            }
        }
        return rentedCars;
    },
}

function checkDate(oDate) {
    let currentDate = new Date();
    if (currentDate.getDate() >= oDate.getDate() || currentDate.getMonth() >= oDate.getMonth() || currentDate.getFullYear() >= oDate.getFullYear()) {
        return true;
    } else {
        return false;
    }
}