const mongoCollections = require('../config/mongoCollections');
const requests = mongoCollections.requests;
const cars = mongoCollections.cars;
const users = mongoCollections.users;
let { ObjectId } = require('mongodb');
const data = require('./cars');

module.exports = {

    async createRequest(username, carId, fromDate, toDate, timePeriod, totalCost) {
        if (!username || !carId || !fromDate || !toDate || !timePeriod || !totalCost) {
            throw "All fields must be present";
        }

        if (!username.trim() ) {
            throw "Username cannot be empty"
          }
          if (username.indexOf(' ') >= 0) {
            throw "Username cannot contain spaces"
          }
        
        if (!timePeriod[0].match("[0-9]+")) {
            throw "Timeperiod's first part must be a number"
        }
        let timePeriod2 = timePeriod;
        if (!parseInt(timePeriod2[0])>0) {
            throw "Timeperiod number must be greater than 0";
        }
        if (!timePeriod.includes("Hour")) {
            if(!timePeriod.includes("Day")) {
                throw "Timperiod missing descriptor Hour or Day";
            }
        }

        let totalCost2 = totalCost;
        totalCost2.split("$");
        if (!totalCost2.match("[0-9]+")) {
            throw "TotalCost must be a number";
        }

        if(!/^\d{4}-\d{2}-\d{2}$/.test(fromDate)) {
            throw "fromDate must be in YYYY-MM-DD format";
        }
        var parts = fromDate.split("-");
        var day = parseInt(parts[2], 10);
        var month = parseInt(parts[1], 10);
        var year = parseInt(parts[0], 10);
        if(year < 1000 || year > 3000 || month == 0 || month > 12) {
            throw "fromDate year & month must be within valid ranges"
        }
        var monthLength = [ 31, 28, 31, 30, 31, 30, 31, 31, 30, 31, 30, 31 ];
        if(year % 400 == 0 || (year % 100 != 0 && year % 4 == 0)) {
            monthLength[1] = 29;
        }
        if (!day > 0 && !day <= monthLength[month - 1]) {
            throw "fromDate day must be within valid range";
        }

        if(!/^\d{4}-\d{2}-\d{2}$/.test(toDate)) {
            throw "toDate must be in YYYY-MM-DD format";
        }
        var parts1 = toDate.split("-");
        var day1 = parseInt(parts1[2], 10);
        var month1 = parseInt(parts1[1], 10);
        var year1 = parseInt(parts1[0], 10);
        if(year1 < 1000 || year1 > 3000 || month1 == 0 || month1 > 12) {
            throw "toDate year & month must be within valid ranges"
        }
        var monthLength1 = [ 31, 28, 31, 30, 31, 30, 31, 31, 30, 31, 30, 31 ];
        if(year1 % 400 == 0 || (year1 % 100 != 0 && year1 % 4 == 0)) {
            monthLength1[1] = 29;
        }
        if (!day1 > 0 && !day1 <= monthLength1[month1 - 1]) {
            throw "toDate day must be within valid range";
        }

        if (arguments.length !== 6) { throw "Expected userId and carId as arguments" }
        if (!username || !carId || !fromDate || !toDate || !timePeriod || !totalCost) {
            throw "None of the feilds should be empty.";
          }
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

    async getAllExtensionRequests() {
        let pendingRequestList = [];
        const requestCollection = await requests();
        const requestList = await requestCollection.find({}).toArray();
        for (let i = 0; i < requestList.length; i++) {
            if (!requestList[i].hasOwnProperty('extensionRequest') && requestList[i].extension) {
                pendingRequestList.push(requestList[i]);
            }
        }
        return pendingRequestList;
    },

    async getAllCancelRequests() {
        let pendingRequestList = [];
        const requestCollection = await requests();
        const requestList = await requestCollection.find({}).toArray();
        for (let i = 0; i < requestList.length; i++) {
            if (!requestList[i].hasOwnProperty('cancelRequest') && requestList[i].cancel) {
                pendingRequestList.push(requestList[i]);
            }
        }
        return pendingRequestList;
    },

    async getAllPendingRequestsByID(username) {
        if (!username) {
            throw "Username field must be present";
        }
        if (!username.trim() ) {
            throw "Username cannot be empty"
          }
          if (username.indexOf(' ') >= 0) {
            throw "Username cannot contain spaces"
          }
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

    async getAllExtensionRequestsByID(username) {
        if (!username) {
            throw "Username field must be present";
        }
        if (!username.trim() ) {
            throw "Username cannot be empty"
          }
          if (username.indexOf(' ') >= 0) {
            throw "Username cannot contain spaces"
          }
        const requestCollection = await requests()
        const requestsList = await requestCollection.find({ username: username }).toArray();
        let pendingRequest = []
        for (i = 0; i < requestsList.length; i++) {
            if (!requestsList[i].hasOwnProperty('extensionRequest') && requestsList[i].extension) {
                pendingRequest.push(requestsList[i]);
            }
        }
        return pendingRequest;
    },

    async getAllCancelRequestsByID(username) {
        if (!username) {
            throw "Username field must be present";
        }
        if (!username.trim() ) {
            throw "Username cannot be empty"
          }
          if (username.indexOf(' ') >= 0) {
            throw "Username cannot contain spaces"
          }
        const requestCollection = await requests()
        const requestsList = await requestCollection.find({ username: username }).toArray();
        let pendingRequest = []
        for (i = 0; i < requestsList.length; i++) {
            if (!requestsList[i].hasOwnProperty('cancelRequest') && requestsList[i].cancel) {
                pendingRequest.push(requestsList[i]);
            }
        }
        return pendingRequest;
    },

    async getRequest(id) {
        if (!id) {
            throw "Id field must be present";
        }
        const requestCollection = await requests();
        let parsedId;
        if (id) {
            parsedId = ObjectId(id);
        }
        const request = await requestCollection.findOne({ _id: parsedId });
        if (request === null) { throw "No request with that id" };
        return request;
    },

    async approveRequest(id, flag) {
        if (!id) {
            throw "All fields must be present";
        }
        id = ObjectId(id);
        let updateRequest = {
            approved: flag
        }
        const requestCollection = await requests();
        let req = await this.getRequest(id)
        let carId = req.carId;
        try{
        const updateInfo = await requestCollection.updateOne({ _id: id }, { $set: updateRequest });
        }
        catch(e){
            throw e
        }
       
        const carCollection = await cars()
        try{
        const updateAvailability = await carCollection.updateOne({ _id: ObjectId(carId) }, { $set: { availability: "NO" } })
        }
        catch(e){
            throw e
        }

    },

    async rejectRequest(id, flag) {
        if (!id) {
            throw "Id fields must be present";
        }
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

    async approveExtensionRequest(id, flag) {
        if (!id) {
            throw "All fields must be present";
        }
        const requestCollection = await requests();
        let req = await this.getRequest(id);
        let newtoDate;
        if(req.extensionPeriod.includes('Hour')){
            newtoDate = req.toDate;
        }else{
            let count = parseInt(req.extensionPeriod);
            let toDateValue = new Date(new Date(req.toDate).getTime()+(1*24*60*60*1000));
            let expectedDate = new Date(new Date(toDateValue).getTime()+(count*24*60*60*1000));
            var month = expectedDate.getUTCMonth() + 1;
            var day = expectedDate.getUTCDate() - 1;
            var year = expectedDate.getUTCFullYear();
            newtoDate = year + "-" + month + "-" + day;
        }
        id = ObjectId(id);
        let updateRequest = {
            extensionRequest: flag,
            toDate:newtoDate
        }
        try{
        const updateInfo = await requestCollection.updateOne({ _id: id }, { $set: updateRequest });
        }
        catch(e){
            throw e
        }
    },

    async approveCancelRequest(id, flag) {
        if (!id) {
            throw "All fields must be present";
        }
        const requestCollection = await requests();
        const carCollection = await cars();

        let req = await this.getRequest(id)
        let carId = req.carId;

        id = ObjectId(id);
        carId = ObjectId(carId);
        let updateRequest = {
            cancelRequest: flag,
            availability: "YES",
            cancel: false
        }

        let updateRequest2 = {
            availability: "YES"
        }
        try{
        const updateInfo = await requestCollection.updateOne({ _id: id }, { $set: updateRequest });
        const updateInfo2 = await carCollection.updateOne({ _id: carId }, { $set: updateRequest2 });
        }
        catch(e){
            throw e
        }
    },

    async rejectExtensionRequest(id, flag) {
        if (!id) {
            throw "Id fields must be present";
        }
        id = ObjectId(id);
        let updateRequest = {
            extensionRequest: flag
        }
        const requestCollection = await requests();
        const updateInfo = await requestCollection.updateOne({ _id: id }, { $set: updateRequest });
        if (updateInfo.modifiedCount === 0) {
            throw "Internal Server Error"
        }
    },

    async rejectCancelRequest(id, flag) {
        if (!id) {
            throw "Id fields must be present";
        }
        id = ObjectId(id);
        let updateRequest = {
            cancelRequest: flag
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
            if (requestList[i].hasOwnProperty('approved') && !requestList[i].cancelRequest) {
                let toDate = checkDate(new Date(new Date(requestList[i].toDate).getTime() + 86400000));
                if (requestList[i].approved && toDate) {
                    rentedCars.push(requestList[i]);
                }
            }
        }
        return rentedCars;
    },

    async getUserCurrentlyRentedCars(username) {
        if (!username) {
            throw "Username field must be present";
        }
        if (!username.trim() ) {
            throw "Username cannot be empty"
          }
          if (username.indexOf(' ') >= 0) {
            throw "Username cannot contain spaces"
          }
        const requestCollection = await requests()
        const requestList = await requestCollection.find({ username: username }).toArray();
        let rentedCars = []
        for (i = 0; i < requestList.length; i++) {
            if (requestList[i].hasOwnProperty('approved') && !requestList[i].cancelRequest) {
                let fromDate = checkDate(new Date(new Date(requestList[i].fromDate).getTime() + 86400000));
                let toDate = checkDate(new Date(new Date(requestList[i].toDate).getTime() + 86400000));
                if (requestList[i].approved && (fromDate || toDate)) {
                    rentedCars.push(requestList[i]);
                }
            }
        }
        return rentedCars;
    },

    async getPastHistoryByID(username) {
        if (!username) {
            throw "Username field must be present";
        }
        if (!username.trim() ) {
            throw "Username cannot be empty"
          }
          if (username.indexOf(' ') >= 0) {
            throw "Username cannot contain spaces"
          }
        const requestCollection = await requests()
        const requestsList = await requestCollection.find({ username: username }).toArray();
        let rentedCars = []
        for (i = 0; i < requestsList.length; i++) {
            if (requestsList[i].hasOwnProperty('approved')) {
                let fromDate = checkPastDate(new Date(new Date(requestsList[i].fromDate).getTime() + 86400000));
                let toDate = checkPastDate(new Date(new Date(requestsList[i].toDate).getTime() + 86400000));
                if (requestsList[i].approved && fromDate && toDate) {
                    rentedCars.push(requestsList[i]);
                    const carCollection = await cars();
                    let req = await this.getRequest(requestsList[i]._id)
                    //console.log(req);
                    let carId = req.carId;
                    //id = ObjectId(id);
                    carId = ObjectId(carId);
                    let updateRequest2 = {
                        availability: "YES"
                    }
                    try {
                        const updateInfo2 = await carCollection.updateOne({ _id: carId }, { $set: updateRequest2 });
                    }
                    catch(e){
                        throw e
                    }
                }
            }
        }
        return rentedCars;
    },

    async createRequestExtension(id,count,timeSpan) {
        if (!id || !count || !timeSpan) {
            throw "All fields must be present";
        }
        var num = /^\d+$/;
        if (!num.test(count)) {
            throw "Count must be a number";
        }
        if (timeSpan != "Hour") {
            if (timeSpan != "Day") {
                throw "timeSpan must be in terms of Hour or Day";
            }
        }
        let req = await this.getRequest(id);
        const car = await data.getCar(req.carId);
        
        let parsedId;
        if (id) {
            parsedId = ObjectId(id);
        }
        
        let newTotal;
        if(timeSpan === "Hour"){
            newTotal = parseInt(count)*parseInt(car.hourlyRate) + parseInt(req.totalCost) +'$'
        }
        else{
            newTotal = parseInt(count)*parseInt(car.hourlyRate)*24 + parseInt(req.totalCost) +'$'
        }
        
        let newRequest = {
            extensionPeriod: count +' '+timeSpan,
            newTotal: newTotal,
            extension : true
        };
        const insertInfo = await requestCollection.updateOne({ _id: parsedId },
            { $set: newRequest });
            if (insertInfo.insertedCount === 0){
                throw "Internal Server Error"
            } else {
                return { requestInserted: true, requestId: id }
            }
    },

    async createRequestCancel(id) {
        if (!id) {
            throw "All fields must be present";
        }
        
        let parsedId;
        if (id) {
            parsedId = ObjectId(id);
        }

        let req = await this.getRequest(parsedId);
        const car = await data.getCar(req.carId);
        
        let newRequest = {
            cancel: true
        };
        const requestCollection = await requests();
        const insertInfo = await requestCollection.updateOne({ _id: parsedId },
            { $set: newRequest });
            if (insertInfo.insertedCount === 0){
                throw "Internal Server Error"
            } else {
                return { requestInserted: true, requestId: id }
            }
    },

}

function checkDate(oDate) {
    if (!oDate) {
        throw "Date must be provided";
    }
    if (!oDate instanceof Date) {
        throw "oDate must be a valid Date";
    }
    let newoDate;
    var month = oDate.getUTCMonth() + 1;
    var day = oDate.getUTCDate() - 1;
    var year = oDate.getUTCFullYear();
    newoDate = year + "-" + month + "-" + day;

     if(year < 1000 || year > 3000 || month == 0 || month > 12) {
        throw "Date must be within valid ranges"
    }
    var monthLength = [ 31, 28, 31, 30, 31, 30, 31, 31, 30, 31, 30, 31 ];
    if(year % 400 == 0 || (year % 100 != 0 && year % 4 == 0)) {
        monthLength[1] = 29;
    }
    if (!day > 0 && !day <= monthLength[month - 1]) {
        throw "Day must be within valid range";
    } 
    let currentDate = new Date();
    if (currentDate.getDate() <= oDate.getDate() && currentDate.getMonth() <= oDate.getMonth() && currentDate.getFullYear() <= oDate.getFullYear()) {
        return true;
    } else {
        return false;
    }
}

function checkPastDate(oDate) {
    if (!oDate) {
        throw "Date must be provided";
    }
    if (!oDate instanceof Date) {
        throw "oDate must be a valid Date";
    }
    let newoDate;
    var month = oDate.getUTCMonth() + 1;
    var day = oDate.getUTCDate() - 1;
    var year = oDate.getUTCFullYear();
    newoDate = year + "-" + month + "-" + day;
 
    if(year < 1000 || year > 3000 || month == 0 || month > 12) {
        throw "Date must be within valid ranges"
    }
    var monthLength = [ 31, 28, 31, 30, 31, 30, 31, 31, 30, 31, 30, 31 ];
    if(year % 400 == 0 || (year % 100 != 0 && year % 4 == 0)) {
        monthLength[1] = 29;
    }
    if (!day > 0 && !day <= monthLength[month - 1]) {
        throw "Day must be within valid range";
    } 
    let currentDate = new Date();
    if (currentDate.getDate() > oDate.getDate() || currentDate.getMonth() > oDate.getMonth() || currentDate.getFullYear() > oDate.getFullYear()) {
        return true;
    } else {
        return false;
    }
}
