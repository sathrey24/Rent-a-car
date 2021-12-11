const express = require('express');
const router = express.Router();
const data = require('../data/');

const xss = require('xss');

router.get('/', async (req, res) => {
    res.render('user/adminLogin');
  });

router.get('/adminDashboard', async(req, res) => {
   const request = await data.requests.getAllRequests();
   const extensionRequest = await data.requests.getAllExtensionRequests();
    res.render('user/adminDashboard',{body: request,extensionRequest:extensionRequest});
  });

router.post('/adminLogin', async (req, res) => {
    if (!xss(req.body.username) || !xss(req.body.password)) {
      res.status(400).render('user/adminLogin', {hasErrors: true, error:"<p>Username and password cannot be empty.</p>"})
      return;
    }
    if (!xss(req.body.username).trim() || !xss(req.body.password).trim()){
      res.status(400).render('user/adminLogin', {hasErrors: true, error:"<p>Username and password cannot be empty.</p>"})
      return;
    }
    if (xss(req.body.username).indexOf(' ') >= 0){
      res.status(400).render('user/adminLogin', {hasErrors: true, error:"<p>Username cannot contain spaces.</p>"})
      return;
    }
    if (xss(req.body.password).indexOf(' ') >= 0){
      res.status(400).render('user/adminLogin', {hasErrors: true, error:"<p>Password cannot contain spaces.</p>"})
      return;
    }
    let username = xss(req.body.username);
    let password = xss(req.body.password);
    try {
      const result = await data.admin.checkUser(username,password);
      if(result.authenticated && result.role === "admin"){
        req.session.user = username;
        req.session.role = result.role;
        res.redirect('/admin/adminDashboard');
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
    const cars = await data.cars.getAllCars();
    res.render('user/carList', {body: cars});
  });

  router.get('/request/:id', async(req,res) =>{
    const request = await data.requests.getRequest(xss(req.params.id));
    const userdetails = await data.users.getUserDetails(request.username);
    const cardetails = await data.cars.getCar(request.carId);
    res.render('user/request', {req: request,car : cardetails, user: userdetails});
  })
  
  router.get('/addCar', (req, res) => {
    res.render('user/addCar');
  });
  
  router.get('/rentedCars', async(req, res) => {
    const rentedcars = await data.requests.getRentedCars();
    res.render('user/rentedCars', {body: rentedcars});
  });
  
  router.post('/addCar', async (req, res) => {
    if (!xss(req.body.model) || !xss(req.body.type) || !xss(req.body.color) || !xss(req.body.numberDoors) || !xss(req.body.seatingCapacity) || !xss(req.body.hourlyRate) || !xss(req.body.availability) || !xss(req.body.engineType)) {
      res.status(400).render('user/addCar', {hasErrors: true, error:"<p>None of the feilds should be empty.</p>"})
      return;
    }
    if(!xss(req.body.hourlyRate).includes('$/hr')){
      res.status(400).render('user/addCar', {hasErrors: true, error:"<p>Hourly Rate should be in $/hr only .</p>"})
      return;
    }
    let model = xss(req.body.model);
    let type = xss(req.body.type);
    let color = xss(req.body.color);
    let numberDoors = xss(req.body.numberDoors);
    let seatingCapacity = xss(req.body.seatingCapacity);
    let hourlyRate = xss(req.body.hourlyRate);
    let availability = xss(req.body.availability);
    let engineType = xss(req.body.engineType);
    try {
      const result = await data.cars.createCar(model, type, color, numberDoors, seatingCapacity, hourlyRate, availability, engineType);
      if(result.carInserted){
        res.redirect('/admin/carList');
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
    var car = await data.cars.getCar(xss(req.params.id))
     res.render('user/editCar', {body: car});
  });
  
  router.get('/deleteCar/:id', async(req, res) => {
    await data.cars.remove(xss(req.params.id));
    const cars = await data.cars.getAllCars();
     res.redirect('/admin/carList');
  });
  
  router.post('/editCars/:id', async (req, res) => {
    const updateCarData = xss(req.body);
    var car = await data.cars.getCar(xss(req.params.id));
    if (!xss(req.body.model) || !xss(req.body.type) || !xss(req.body.color) || !xss(req.body.numberDoors) || !xss(req.body.seatingCapacity) || !xss(req.body.hourlyRate) || !xss(req.body.availability) || !xss(req.body.engineType)) {
      res.status(400).render('user/editCar', {hasErrors: true, error:"<p>None of the feilds should be empty.</p>",body: car})
      return;
    }
    if(!xss(req.body.hourlyRate).includes('$/hr')){
      res.status(400).render('user/editCar', {hasErrors: true, error:"<p>Hourly Rate should be in $/hr only .</p>",body: car})
      return;
    }
      try {
        const {model, type, color, numberDoors, seatingCapacity, hourlyRate, availability, engineType} = updateCarData;
        const updatedData = await data.cars.update(xss(req.params.id),model, type, color, numberDoors, seatingCapacity, hourlyRate, availability, engineType);
        if(updatedData.carInserted){
          res.redirect('/admin/carList');
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

  router.get('/approveRequest/:id', async(req, res) => {
    await data.requests.approveRequest(xss(req.params.id),true);
     res.redirect('/admin/adminDashboard');
  });

  router.get('/rejectRequest/:id', async(req, res) => {
    await data.requests.rejectRequest(xss(req.params.id),false);
     res.redirect('/admin/adminDashboard');
  });

  router.get('/approveExtenRequest/:id', async(req, res) => {
    await data.requests.approveExtensionRequest(xss(req.params.id),true);
     res.redirect('/admin/adminDashboard');
  });

  router.get('/rejectExtenRequest/:id', async(req, res) => {
    await data.requests.rejectExtensionRequest(xss(req.params.id),false);
     res.redirect('/admin/adminDashboard');
  });

  router.get('/request/ext/:id', async(req,res) =>{
    const request = await data.requests.getRequest(xss(req.params.id));
    const userdetails = await data.users.getUserDetails(request.username);
    const cardetails = await data.cars.getCar(request.carId);
    res.render('user/request', {req: request,car : cardetails, user: userdetails,extension:true});
  })

module.exports = router;