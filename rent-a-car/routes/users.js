const express = require('express');
const router = express.Router();
const data = require('../data/users');

router.get('/', (req, res) => {
      res.render('user/landingpage');
});

router.get('/login', (req, res) => {
  res.render('user/login');
});

router.get('/register', (req, res) => {
  res.render('user/register');
});

router.post('/login', async (req, res) => {
  let username = req.body.username;
  let password = req.body.password;
  try {
    const result = await data.checkUser(username,password);
    if(result.authenticated){
      req.session.username = username;
      res.render('user/userDashboard', { user: req.session.username });
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
    const result = await data.createUser(firstName,lastName,address,email,phoneNum,licenseNum,username, password);
    if(result.userInserted){
      req.session.username = username;
      res.render('user/login', { user: req.session.username });
    }
  } catch (e) {
    res.status(400).render('user/register', {
      error: "Error : " + e,
      hasErrors : true
    });
    return;
  }
});

module.exports = router;