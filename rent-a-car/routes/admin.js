const express = require('express');
const router = express.Router();
const data = require('../data/');


router.get('/', async (req, res) => {
    res.render('user/adminLogin');
  });

router.get('/adminDashboard', (req, res) => {
    res.render('user/adminDashboard');
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
    var car = await data.cars.getCar(req.params.id)
     res.render('user/editCar', {body: car});
  });
  
  router.get('/deleteCar/:id', async(req, res) => {
    await data.cars.remove(req.params.id);
    const cars = await data.cars.getAllCars();
     res.render('user/carList', {body: cars});
  });
  
  router.post('/editCars/:id', async (req, res) => {
    const updateCarData = req.body;
    var car = await data.cars.getCar(req.params.id)
      try {
        const {model, type, color, numberDoors, seatingCapacity, hourlyRate, availability, engineType} = updateCarData;
        const updatedData = await data.cars.update(req.params.id,model, type, color, numberDoors, seatingCapacity, hourlyRate, availability, engineType);
        if(updatedData.carInserted){
          const cars = await data.cars.getAllCars();
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

module.exports = router;