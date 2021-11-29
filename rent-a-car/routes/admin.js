// const express = require('express');
// const router = express.Router();
// const data = require('../data/admin');

// router.post('/admin', async (req, res) => {
//       try {
//         await data.createAdmin("Patrick", "Hill", "phill@stevens.edu", "password4", "444-444-4444", "phill@stevens.edu");
//       } catch (e) {
//       }
//     });

// router.get('/admin', (req, res) => {
//     res.render('user/adminLogin');
// });

// router.post('/adminLogin', async (req, res) => {
//     if (!req.body.ausername || !req.body.password) {
//       res.status(400).render('user/adminLogin', {hasErrors: true, error:"<p>Username and password cannot be empty.</p>"})
//       return;
//     }
//     if (!req.body.ausername.trim() || !req.body.password.trim()){
//       res.status(400).render('user/adminLogin', {hasErrors: true, error:"<p>Username and password cannot be empty.</p>"})
//       return;
//     }
//     if (req.body.ausername.indexOf(' ') >= 0){
//       res.status(400).render('user/adminLogin', {hasErrors: true, error:"<p>Username cannot contain spaces.</p>"})
//       return;
//     }
//     if (req.body.apassword.indexOf(' ') >= 0){
//       res.status(400).render('user/adminLogin', {hasErrors: true, error:"<p>Password cannot contain spaces.</p>"})
//       return;
//     }
//     let username = req.body.ausername;
//     let password = req.body.apassword;
//     try {
//       const result = await data.checkUser(username,password);
//       if(result.authenticated && result.role == "admin"){
//         req.session.user = username;
//         res.redirect('/adminDashboard');
//       }
//     } catch (e) {
//       res.status(400).render('user/adminDashboard', {
//         error: "Error : " + e,
//         hasErrors : true
//       });
//       return;
//     }
//   });

// module.exports = router;