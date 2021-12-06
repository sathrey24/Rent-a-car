const mongoCollections = require('../config/mongoCollections');
const admin = mongoCollections.admin;
const bcrypt = require('bcrypt');
const saltRounds = 16;

module.exports = {
    async createAdmin(firstName, lastName,username, password, phoneNumber, email ){
        const hashPasswd = await bcrypt.hash(password, saltRounds);
        let newAdmin = {
            firstName:firstName,
            lastName:lastName,
            username: username.toLowerCase(),
            password: hashPasswd,
            role: "admin",
            phoneNumber: phoneNumber,
            email: email
        }
        const adminCollection = await admin()
        await adminCollection.insertOne(newAdmin);
    },

    async checkUser(username, password){
        let compareToMatch = false;
        if (!username || !password) throw 'All fields need to have valid values';
        const adminCollection = await admin();
        const res = await adminCollection.findOne({ username: username.toLowerCase() });
        if (res === null) throw "Either the username or password is invalid";
        compareToMatch = await bcrypt.compare(password, res.password);
        if(compareToMatch){
          return {authenticated: true,role : res.role, id:res._id.toString()};
        }else{
          throw "Either the username or password is invalid";
        }
    }
};