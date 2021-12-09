const express = require('express');
const router = express.Router();
const data = require('../data/');

router.get('/', (req, res) => {
  if (req.session.role === "user") {
    res.render('user/landingpage', { user: true, admin: false, login: false });
  }
  else if (req.session.role === "admin") {
    res.render('user/landingpage', { user: false, admin: true, login: false });
  } else {
    res.render('user/landingpage', { login: true });
  }
});

router.get('/login', (req, res) => {
  res.render('user/login');
});

router.get('/logout', (req, res) => {
  req.session.destroy();
  res.clearCookie("AuthCookie")
  res.render('user/logout', { link: "http://localhost:3000" })
})

router.get('/register', (req, res) => {
  res.render('user/register');
});

router.get('/userHistory', async (req, res) => {
  const requestList = await data.requests.getAllRequestsByID(req.session.user);
  res.render('user/userHistory', { body: requestList });
});

router.get('/userProfile', async (req, res) => {
  const user = await data.users.getUserDetails(req.session.user)
  res.render('user/userProfile', { body: user });
});

router.get('/userDashboard', async function (req, res) {
  const cars = await data.cars.getAvailableCars();
  const request = await data.requests.getAllPendingRequestsByID(req.session.user);
  let all_CarIDS = []
  let request_CarIDS = []
  let filtered = []
  let carList = []
  for (i = 0; i < cars.length; i++){
    all_CarIDS.push(cars[i]._id.toString())
  }
  for (i = 0; i < request.length; i++){
    request_CarIDS.push(request[i].carId)
  }
  filtered = all_CarIDS.filter(item => !request_CarIDS.includes(item));
  for (i = 0; i < filtered.length; i++){
    const thecar = await data.cars.getCar(filtered[i])
    carList.push(thecar)
  }
  let reqs;
  if (request.length > 0) {
    reqs = request[0]._id.toString();
  } else {
    reqs = [];
  }
  res.render('user/userDashboard', { body: carList, request: reqs });
});

router.post('/login', async (req, res) => {
  if (!req.body.username || !req.body.password) {
    res.status(400).render('user/login', { hasErrors: true, error: "<p>Username and password cannot be empty.</p>" })
    return;
  }
  if (!req.body.username.trim() || !req.body.password.trim()) {
    res.status(400).render('user/login', { hasErrors: true, error: "<p>Username and password cannot be empty.</p>" })
    return;
  }
  if (req.body.username.indexOf(' ') >= 0) {
    res.status(400).render('user/login', { hasErrors: true, error: "<p>Username cannot contain spaces.</p>" })
    return;
  }
  if (req.body.password.indexOf(' ') >= 0) {
    res.status(400).render('user/login', { hasErrors: true, error: "<p>Password cannot contain spaces.</p>" })
    return;
  }
  let username = req.body.username;
  let password = req.body.password;
  try {
    const result = await data.users.checkUser(username, password);
    if (result.authenticated && result.role == "user") {
      req.session.user = username;
      req.session.role = result.role;
      res.redirect('/userDashboard');
    }
  } catch (e) {
    res.status(400).render('user/login', {
      error: "Error : " + e,
      hasErrors: true
    });
    return;
  }
});
router.get('/request/:id', async(req,res) =>{
  const request = await data.requests.getRequest(req.params.id);
  const userdetails = await data.users.getUserDetails(request.username);
  const cardetails = await data.cars.getCar(request.carId);
  res.render('user/userRequest', {req: request,car : cardetails, user: userdetails});
})

router.get('/allRequests/:id', async(req,res) =>{
  const request = await data.requests.getRequest(req.params.id);
  const requestList = await data.requests.getAllPendingRequestsByID(request.username)
  for (i = 0; i < requestList.length; i++){
    const car = await data.cars.getCar(requestList[i].carId)
    requestList[i].model = car.model
  }
  res.render('user/allRequests', {body: requestList});
})
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
    if (!phoneRegex.test(phoneNum)) {
      throw "Phone number must be of format XXX-XXX-XXXX"
    }
    if (!/^[A-Za-z]{1}[0-9]{14}$/.test(licenseNum)) {
      throw "License must be valid NJ license number"
    }
    const result = await data.users.createUser(firstName, lastName, address, email, phoneNum, licenseNum, username, password);
    if (result.userInserted) {
      res.render('user/login');
    }
  }
  catch (e) {
    res.status(403).render('user/register', {
      error: "Error : " + e,
      hasErrors: true,
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

router.get('/bookCar/:id', async(req,res) =>{
  const car = await data.cars.getCar(req.params.id);
  res.status(400).render('user/carDetails', { details: car, role: true,hasErrors: true, error: "<p>None of the fields should be empty.</p>" })
})

router.post('/bookCar/:id', async (req, res) => {
  const car = await data.cars.getCar(req.params.id);
  if (!req.body.fromDate || !req.body.toDate || !req.body.count || !req.body.timePeriod) {
    res.status(400).redirect(`/bookCar/${req.params.id}`)
    return;
  }
  let fromDate = req.body.fromDate;
  let toDate = req.body.toDate;
  let timePeriod = req.body.count + ' ' + req.body.timePeriod;
  try {
    const result = await data.requests.createRequest(req.session.user, req.params.id, fromDate, toDate, timePeriod, req.body.total);
    if (result.requestInserted) {
      res.redirect('/userDashboard');
    }
  } catch (e) {
    res.status(400).render('user/carDetails', {
      role: true,
      error: "Error : " + e,
      hasErrors: true,
      details: car,
    });
    return;
  }
});

// router.post('/review/:id', async (req, res) => {
//   if (!req.body.review || !req.body.rate) {
//     res.status(400).render('user/History', {hasErrors: true, error:"<p>None of the feilds should be empty.</p>"})
//     return;
//   }
//   let review = req.body.review;
//   let rate = req.body.rate;
//   try {
//     const result = await data.reviews.createReview(req.session.user, req.params.id,review,rate);
//     if(result.reviewInserted){
//       res.redirect('/History');
//     }
//   } catch (e) {
//     res.status(400).render('user/History', {
//       error: "Error : " + e,
//       hasErrors : true
//     });
//     return;
//   }
// });

module.exports = router;
