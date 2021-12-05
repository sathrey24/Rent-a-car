const express = require('express');
const router = express.Router();
const data = require('../data/');

router.get('/', (req, res) => {
  if(req.session.role === "user"){
    res.render('user/landingpage', {user: true,admin: false,login:false});
  }
  else if(req.session.role === "admin"){
    res.render('user/landingpage', {user:false,admin:true,login:false});
  }else{
    res.render('user/landingpage',{login: true});
  }
});

router.get('/login', (req, res) => {
  res.render('user/login');
});

router.get('/logout', (req,res) => {
  req.session.destroy();
  res.clearCookie("AuthCookie")
  res.render('user/logout', {link: "http://localhost:3000"})
})

router.get('/register', (req, res) => {
  res.render('user/register');
});

router.get('/userHistory', (req, res) => {
  res.render('user/userHistory');
});

router.get('/adminDashboard', (req, res) => {
  res.render('user/adminDashboard');
});

router.get('/userDashboard', async function(req, res) {
  const cars = await data.cars.getAvailableCars()
  res.render('user/userDashboard', {body: cars});
});

router.post('/login', async (req, res) => {
  if (!req.body.username || !req.body.password) {
    res.status(400).render('user/login', {hasErrors: true, error:"<p>Username and password cannot be empty.</p>"})
    return;
  }
  if (!req.body.username.trim() || !req.body.password.trim()){
    res.status(400).render('user/login', {hasErrors: true, error:"<p>Username and password cannot be empty.</p>"})
    return;
  }
  if (req.body.username.indexOf(' ') >= 0){
    res.status(400).render('user/login', {hasErrors: true, error:"<p>Username cannot contain spaces.</p>"})
    return;
  }
  if (req.body.password.indexOf(' ') >= 0){
    res.status(400).render('user/login', {hasErrors: true, error:"<p>Password cannot contain spaces.</p>"})
    return;
  }
  let username = req.body.username;
  let password = req.body.password;
  try {
    const result = await data.users.checkUser(username,password);
    if(result.authenticated && result.role == "user"){
      req.session.user = username;
      req.session.role = result.role;
      res.redirect('/userDashboard');
    }
  } catch (e) {
    res.status(400).render('user/login', {
      error: "Error : " + e,
      hasErrors : true
    });
    return;
  }
});

router.post('/register', async (req, res) => {
  let firstName = req.body.firstName;
  let lastName = req.body.lastName;
  let address = req.body.address;
  let email = req.body.email;
  let phoneNum = req.body.phoneNum;
  let licenseNum = req.body.licenseNum;
  let username = req.body.username;
  let password = req.body.password;
  try {
    if (!firstName || !lastName || !address || !email || !phoneNum || !licenseNum || !username || !password) {
      throw "All fields have to be non-empty"
    }
    if (!username.trim() || !password.trim()){
      throw "Username and password cannot be empty"
    }
    if (username.indexOf(' ') >= 0){
      throw "Username cannot contain spaces"
    }
    if (password.indexOf(' ') >= 0){
      throw "Password cannot contain spaces"
    }
    if (!/^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/.test(email)){
      throw "Email must be valid"
    }
    let phoneRegex = /^\d{3}-\d{3}-\d{4}$/
    if (!phoneRegex.test(phoneNum)){ 
      throw "Phone number must be of format XXX-XXX-XXXX"
    }
    if (!/^[A-Za-z]{1}[0-9]{14}$/.test(licenseNum)){
      throw "License must be valid NJ license number"
    }
    const result = await data.users.createUser(firstName,lastName,address,email,phoneNum,licenseNum,username, password);
      if(result.userInserted){
        res.render('user/login');
      } 
  }
   catch (e) {
    res.status(403).render('user/register', {
      error: "Error : " + e,
      hasErrors : true,
      firstName: firstName,
      lastName: lastName,
      address: address, 
      email: email,
      phoneNum: phoneNum,
      licenseNum: licenseNum,
      username: username,
      password: password
    });
    return;
  }
});

router.get('/admin', async (req, res) => {
  // await data.admin.createAdmin("Patrick", "Hill", "phill@stevens.edu", "password4", "444-444-4444", "phill@stevens.edu");
  res.render('user/adminLogin');
});

router.post('/adminLogin', async (req, res) => {
  if (!req.body.username || !req.body.password) {
    res.status(400).render('user/adminLogin', {hasErrors: true, error:"<p>Username and password cannot be empty.</p>"})
    return;
  }
  if (!req.body.username.trim() || !req.body.password.trim()){
    res.status(400).render('user/adminLogin', {hasErrors: true, error:"<p>Username and password cannot be empty.</p>"})
    return;
  }
  if (req.body.username.indexOf(' ') >= 0){
    res.status(400).render('user/adminLogin', {hasErrors: true, error:"<p>Username cannot contain spaces.</p>"})
    return;
  }
  if (req.body.password.indexOf(' ') >= 0){
    res.status(400).render('user/adminLogin', {hasErrors: true, error:"<p>Password cannot contain spaces.</p>"})
    return;
  }
  let username = req.body.username;
  let password = req.body.password;
  try {
    const result = await data.admin.checkUser(username,password);
    if(result.authenticated && result.role == "admin"){
      req.session.user = username;
      req.session.role = result.role;
      res.render('user/adminDashboard');
    }
  } catch (e) {
    res.status(400).render('user/adminLogin', {
      error: "Error : " + e,
      hasErrors : true
    });
    return;
  }
});

router.get('/carList', async(req, res) => {
  const cars = await data.cars.getAvailableCars();
  res.render('user/carList', {body: cars});
});

router.get('/addCar', (req, res) => {
  res.render('user/addCar');
});

router.get('/rentedCars', (req, res) => {
  res.render('user/rentedCars');
});

router.post('/addCar', async (req, res) => {
  if (!req.body.model || !req.body.type || !req.body.color || !req.body.numberDoors || !req.body.seatingCapacity || !req.body.hourlyRate || !req.body.availability || !req.body.engineType) {
    res.status(400).render('user/addCar', {hasErrors: true, error:"<p>None of the feilds should be empty.</p>"})
    return;
  }
  if (req.body.numberDoors <= 0 || req.body.seatingCapacity <= 0 ) {
    res.status(400).render('user/addCar', {hasErrors: true, error:"<p>Number of Doors and Seating Capacity cannot be 0 or less then 0.</p>"})
    return;
  }
  let model = req.body.model;
  let type = req.body.type;
  let color = req.body.color;
  let numberDoors = req.body.numberDoors;
  let seatingCapacity = req.body.seatingCapacity;
  let hourlyRate = req.body.hourlyRate;
  let availability = req.body.availability;
  let engineType = req.body.engineType;
  try {
    const result = await data.cars.createCar(model, type, color, numberDoors, seatingCapacity, hourlyRate, availability, engineType);
    if(result.authenticated){
      const cars = await data.cars.getAvailableCars();
      res.render('user/carList', {body: cars});
    }
  } catch (e) {
    res.status(400).render('user/addCar', {
      error: "Error : " + e,
      hasErrors : true
    });
    return;
  }
});

router.get('/editCar/:id', async(req, res) => {
  var car = await data.cars.getCar(req.params.id)
   res.render('user/editCar', {body: car});
});

router.get('/deleteCar/:id', async(req, res) => {
  await data.cars.remove(req.params.id);
  const cars = await data.cars.getAvailableCars();
   res.render('user/carList', {body: cars});
});

router.post('/editCars/:id', async (req, res) => {
  const updateCarData = req.body;
  var car = await data.cars.getCar(req.params.id)
    try {
      const {model, type, color, numberDoors, seatingCapacity, hourlyRate, availability, engineType} = updateCarData;
      const updatedData = await data.cars.update(req.params.id,model, type, color, numberDoors, seatingCapacity, hourlyRate, availability, engineType);
      if(updatedData.carInserted){
        const cars = await data.cars.getAvailableCars();
        res.render('user/carList', {body: cars});
      }
    } catch (e) {
        res.status(400).render('user/editCar', {
        error: "Error : " + e,
        hasErrors : true,
        body: car
      });
      return;
    }
});

module.exports = router;