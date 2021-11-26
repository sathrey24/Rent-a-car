const mongoCollections = require('../config/mongoCollections');
const admin = mongoCollections.admin;

module.exports = {
    async createAdmin(firstName, lastName, username, password, phoneNumber, email){
        let newAdmin = {
            firstName:firstName,
            lastName:lastName,
            username: username,
            password: password,
            role: "admin",
            phoneNumber: phoneNumber,
            email: email
        }
        const adminCollection = await admin()
        const res = await adminCollection.findOne({ username: username.toLowerCase() });
        if (res != null) throw "Admin with this username already exist";
        const insertInfo = await adminCollection.insertOne(newAdmin);
        if (insertInfo.insertedCount === 0){
            throw "Internal Server Error"
        } else {
            return {adminInserted: true}
        }
    }
};