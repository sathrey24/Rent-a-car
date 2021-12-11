const mongoCollections = require('../config/mongoCollections');
const admin = mongoCollections.admin;
const bcrypt = require('bcrypt');
const saltRounds = 16;

module.exports = {
    async createAdmin(firstName, lastName,username, password, phoneNumber, email ){
      if (!firstName || !lastName || !username || !password || !phoneNumber || !email) {
        throw 'All fields need to have valid values';
      }
      if (!username.trim() || !password.trim()) {
        throw "Username and password cannot be empty"
      }
      if (username.indexOf(' ') >= 0) {
        throw "Username cannot contain spaces"
      }
      if (password.indexOf(' ') >= 0) {
        throw "Password cannot contain spaces"
      }
      if (!/^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/.test(email)) {
        throw "Email must be valid"
      }
      let phoneRegex = /^\d{3}-\d{3}-\d{4}$/
      if (!phoneRegex.test(phoneNumber)) {
        throw "Phone number must be of format XXX-XXX-XXXX"
      }
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
        if (!username.trim() || !password.trim()) {
          throw "Username and password cannot be empty"
        }
        if (username.indexOf(' ') >= 0) {
          throw "Username cannot contain spaces"
        }
        if (password.indexOf(' ') >= 0) {
          throw "Password cannot contain spaces"
        }
        const adminCollection = await admin();
        const res = await adminCollection.findOne({ username: username.toLowerCase() });
        if (res === null) throw "Either the username or password is invalid";
        compareToMatch = await bcrypt.compare(password, res.password);
        if(compareToMatch){
          return {authenticated: true,role : res.role};
        }else{
          throw "Either the username or password is invalid";
        }
    }
};