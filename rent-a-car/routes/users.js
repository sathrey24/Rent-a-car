const express = require('express');
const router = express.Router();
const data = require('../data/');
const mongoCollections = require('../config/mongoCollections');
const reviews = mongoCollections.reviews;

const xss = require('xss');

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
  const requestList = await data.requests.getPastHistoryByID(req.session.user);
  const currentrequestList = await data.requests.getUserCurrentlyRentedCars(req.session.user);
  res.render('user/userHistory', { body: requestList , currentRequest : currentrequestList});
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
  const extensionrequest = await data.requests.getAllExtensionRequestsByID(req.session.user);
  let extenreqs;
  if (extensionrequest.length > 0) {
    extenreqs = extensionrequest[0]._id.toString();
  } else {
    extenreqs = [];
  }

  const cancelrequest = await data.requests.getAllCancelRequestsByID(req.session.user);
  let cancelreqs;
  if (cancelrequest.length > 0) {
    cancelreqs = cancelrequest[0]._id.toString();
  } else {
    cancelreqs = [];
  }
  res.render('user/userDashboard', { body: carList, request: reqs ,extension :extensionrequest,extenreqs:extenreqs, cancel: cancelrequest, cancelreqs:cancelreqs});
});

router.post('/login', async (req, res) => {
  if (!xss(req.body.username) || !xss(req.body.password)) {
    res.status(400).render('user/login', { hasErrors: true, error: "<p>Username and password cannot be empty.</p>" })
    return;
  }
  if (!xss(req.body.username).trim() || !xss(req.body.password).trim()) {
    res.status(400).render('user/login', { hasErrors: true, error: "<p>Username and password cannot be empty.</p>" })
    return;
  }
  if (xss(req.body.username).indexOf(' ') >= 0) {
    res.status(400).render('user/login', { hasErrors: true, error: "<p>Username cannot contain spaces.</p>" })
    return;
  }
  if (xss(req.body.password).indexOf(' ') >= 0) {
    res.status(400).render('user/login', { hasErrors: true, error: "<p>Password cannot contain spaces.</p>" })
    return;
  }
  let username = xss(req.body.username);
  let password = xss(req.body.password);
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
  const request = await data.requests.getRequest(xss(req.params.id));
  const userdetails = await data.users.getUserDetails(request.username);
  const cardetails = await data.cars.getCar(request.carId);
  
  try{
    const reviewsCollection = await reviews()
          let reviewArray = await reviewsCollection.find({carId: cardetails}).toArray()
          var car_reviews = []
          for (i = 0; i < reviewArray.length; i++){
              car_reviews.push({text: reviewArray[i].reviewText, rating: reviewArray[i].rating})
          }
        }
        catch (e) {
          var car_reviews = null;
        }
    res.render('user/userRequest', {req: request,car : cardetails, user: userdetails, rev : car_reviews});
})

router.get('/request/review/:id', async(req,res) =>{
  const request = await data.requests.getRequest(xss(req.params.id));
  const userdetails = await data.users.getUserDetails(request.username);
  const cardetails = await data.cars.getCar(request.carId);
  const reviewsCollection = await reviews();
        let reviewArray = await reviewsCollection.find({carId: request.carId}).toArray()
        var car_reviews = []
        for (i = 0; i < reviewArray.length; i++){
            car_reviews.push({reviewText: reviewArray[i].reviewText, rating: reviewArray[i].rating})
        }
  let already_Reviewed = 0;
  for (i = 0; i < reviewArray.length; i++){
    if (userdetails.reviewsGiven.includes(reviewArray[i]._id.toString())){
      already_Reviewed +=1;
    }
  }
  let check = await reviewsCollection.find({$and: [{carId: request.carId}, {username: request.username}]}).toArray()
  if ((already_Reviewed == check.length) && (already_Reviewed !== 0)){
    res.render('user/userRequest', {reviewed : true, req: request,car : cardetails, user: userdetails,review : true, rev : car_reviews});
  } else{
    res.render('user/userRequest', {reviewed: false, req: request,car : cardetails, user: userdetails,review : true, rev : car_reviews});
  }
})

router.get('/request/extension/:id', async(req,res) =>{
  const request = await data.requests.getRequest(xss(req.params.id));
  const userdetails = await data.users.getUserDetails(request.username);
  const cardetails = await data.cars.getCar(request.carId);
  const requestPending = await data.requests.getAllExtensionRequestsByID(request.username);
  let already_Requested = false;
  for (i= 0; i < requestPending.length; i++){
    if (requestPending[i]._id.toString()== req.params.id && requestPending[i].hasOwnProperty('extension')){
      already_Requested = true;
    }
    if (requestPending[i]._id.toString() == req.params.id && !requestPending[i].hasOwnProperty('extension')){
      already_Requested = false;
    }
  }
  if(!already_Requested){
    res.render('user/userRequest', {req: request,car : cardetails, user: userdetails,extension : true});
  }else{
    res.render('user/userRequest', {req: request,car : cardetails, user: userdetails,extension : false});
  } 
})

router.get('/request/cancel/:id', async(req,res) =>{
  const request = await data.requests.getRequest(xss(req.params.id));
  const userdetails = await data.users.getUserDetails(request.username);
  const cardetails = await data.cars.getCar(request.carId);
  const requestPending = await data.requests.getAllCancelRequestsByID(request.username);
  let already_Canceled = false;
  for (i= 0; i < requestPending.length; i++){
    if (requestPending[i]._id.toString()== req.params.id && requestPending[i].hasOwnProperty('cancel')){
      already_Canceled = true;
    }
    if (requestPending[i]._id.toString() == req.params.id && !requestPending[i].hasOwnProperty('cancel')){
      already_Canceled = false;
    }
  }
  if(!already_Canceled){
    res.render('user/userRequest', {req: request,car : cardetails, user: userdetails,cancel : true});
  }else{
    res.render('user/userRequest', {req: request,car : cardetails, user: userdetails,cancel : false});
  } 
})

router.get('/allRequests/:id', async(req,res) =>{
  const request = await data.requests.getRequest(xss(req.params.id));
  const requestList = await data.requests.getAllPendingRequestsByID(request.username)
  for (i = 0; i < requestList.length; i++){
    const car = await data.cars.getCar(requestList[i].carId)
    requestList[i].model = car.model
  }
  res.render('user/allRequests', {body: requestList,request : true});
})

router.get('/allRequests/extension/:id', async(req,res) =>{
  const request = await data.requests.getRequest(xss(req.params.id));
  const requestList = await data.requests.getAllExtensionRequestsByID(request.username)
  for (i = 0; i < requestList.length; i++){
    const car = await data.cars.getCar(requestList[i].carId)
    requestList[i].model = car.model
  }
  res.render('user/allRequests', {body: requestList,extension:true});
})

router.get('/allRequests/cancel/:id', async(req,res) =>{
  const request = await data.requests.getRequest(xss(req.params.id));
  const requestList = await data.requests.getAllCancelRequestsByID(request.username)
  for (i = 0; i < requestList.length; i++){
    const car = await data.cars.getCar(requestList[i].carId)
    requestList[i].model = car.model
  }
  res.render('user/allRequests', {body: requestList,cancel:true});
})

router.post('/register', async (req, res) => {
  let firstName = xss(req.body.firstName);
  let lastName = xss(req.body.lastName);
  let address = xss(req.body.address);
  let email = xss(req.body.email);
  let phoneNum = xss(req.body.phoneNum);
  let licenseNum = xss(req.body.licenseNum);
  let username = xss(req.body.username);
  let password = xss(req.body.password);
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
      res.redirect('/login');
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
  const car = await data.cars.getCar(xss(eq.params.id));
  res.status(400).render('user/carDetails', { details: car, role: true,hasErrors: true, error: "<p>None of the fields should be empty.</p>" })
})

router.post('/bookCar/:id', async (req, res) => {
  const car = await data.cars.getCar(xss(req.params.id));
  if (!xss(req.body.fromDate) || !xss(req.body.toDate) || !xss(req.body.count) || !xss(req.body.timePeriod) || !xss(req.body.total)) {
    res.status(400).redirect(`/bookCar/${req.params.id}`)
    return;
  }
  let fromDate = xss(req.body.fromDate);
  let toDate = xss(req.body.toDate);
  let timePeriod = xss(req.body.count) + ' ' + xss(req.body.timePeriod);
  try {
    const result = await data.requests.createRequest(req.session.user, xss(req.params.id), fromDate, toDate, timePeriod, xss(req.body.total));
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

router.post('/review/:id', async (req, res) => {
  const request = await data.requests.getRequest(req.params.id);
  const userdetails = await data.users.getUserDetails(request.username);
  const cardetails = await data.cars.getCar(request.carId);
  if (!xss(req.body.review) || !xss(req.body.rating)) {
    res.status(400).render('user/userRequest', {req: request,car : cardetails, user: userdetails,review : true, hasErrors: true, error:"<p>None of the feilds should be empty.</p>"})
    return;
  }
  let review = xss(req.body.review);
  let rate = xss(req.body.rating);
  try {
    const result = await data.reviews.createReview(req.session.user, xss(req.params.id),review,rate);
    if(result.reviewInserted){
      res.redirect(`/request/review/${xss(req.params.id)}`);
    }
  } catch (e) {
    res.status(400).render(`/request/extension/${xss(req.params.id)}`, {
      error: "Error : " + e,
      hasErrors : true,
      req: request,car : cardetails, user: userdetails,review : true
    });
    return;
  }
});

router.post('/extension/:id', async (req, res) => {
  const request = await data.requests.getRequest(xss(req.params.id));
  const userdetails = await data.users.getUserDetails(request.username);
  const cardetails = await data.cars.getCar(request.carId);
  if (!req.body.count || !req.body.timePeriod) {
    res.status(400).render('user/userRequest', {req: request,car : cardetails, user: userdetails,extension : true , hasErrors: true, error:"<p>None of the feilds should be empty.</p>"})
    return;
  }
  let count = req.body.count;
  let timePeriod = req.body.timePeriod;
  try {
    const result = await data.requests.createRequestExtension(xss(req.params.id),count,timePeriod);
    if(result.requestInserted){
      res.redirect('/userHistory');
    }
  } catch (e) {
    res.status(400).render('user/userRequest', {
      error: "Error : " + e,
      hasErrors : true,
      req: request,car : cardetails, user: userdetails,extension : true
    });
    return;
  }
});

router.post('/cancel/:id', async (req, res) => {
  const request = await data.requests.getRequest(xss(req.params.id));
  const userdetails = await data.users.getUserDetails(request.username);
  const cardetails = await data.cars.getCar(request.carId);
  try {
    const result = await data.requests.createRequestCancel(xss(req.params.id));
    if(result.requestInserted){
      res.redirect('/userHistory');
    }
  } catch (e) {
    res.status(400).render('user/userRequest', {
      error: "Error : " + e,
      hasErrors : true,
      req: request,car : cardetails, user: userdetails,cancel : true
    });
    return;
  }
});

module.exports = router;
