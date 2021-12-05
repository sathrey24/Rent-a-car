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

module.exports = router;