const express = require('express');
const app = express();
const session = require('express-session');
const static = express.static(__dirname + '/public');
const cookieParser = require('cookie-parser');

const configRoutes = require('./routes');
const exphbs = require('express-handlebars');

app.use('/public', static);
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());

const xss = require('xss');

app.use(
  session({
    name: 'AuthCookie',
    secret: "This is a secret.. shhh don't tell anyone",
    saveUninitialized: true,
    resave: false,
  })
);

app.use('/userDashboard', (req, res, next) => {
  if (!xss(req.session.user) && xss(req.session.role) !== "user") {
    return res.status(403).render('user/error', {error: "You must be logged in to view your dashboard.Click below link to login :",link: "http://localhost:3000"})
  } else {
    next();
  }
});

app.use('/cars/:id', (req, res, next) => {
  if (!xss(req.session.user) && xss(req.session.role) !== "user") {
    return res.status(403).render('user/error', {error: "You must be logged in to view your dashboard.Click below link to login :",link: "http://localhost:3000"})
  } else {
    next();
  }
});

app.use('/request/:id', (req, res, next) => {
  if (!xss(req.session.user) && xss(req.session.role) !== "user") {
    return res.status(403).render('user/error', {error: "You must be logged in to view your dashboard.Click below link to login :",link: "http://localhost:3000"})
  } else {
    next();
  }
});

app.use('/userHistory', (req, res, next) => {
  if (!xss(req.session.user) && xss(req.session.role) !== "user") {
    return res.status(403).render('user/error', {error: "You must be logged in to view your dashboard.Click below link to login :",link: "http://localhost:3000"})
  } else {
    next();
  }
});

app.use('/userProfile', (req, res, next) => {
  if (!xss(req.session.user) && xss(req.session.role) !== "user") {
    return res.status(403).render('user/error', {error: "You must be logged in to view your dashboard.Click below link to login :",link: "http://localhost:3000"})
  } else {
    next();
  }
});

app.use('/request/review/:id', (req, res, next) => {
  if (!xss(req.session.user) && xss(req.session.role) !== "user") {
    return res.status(403).render('user/error', {error: "You must be logged in to view your dashboard.Click below link to login :",link: "http://localhost:3000"})
  } else {
    next();
  }
});

app.use('/request/extension/:id', (req, res, next) => {
  if (!xss(req.session.user) && xss(req.session.role) !== "user") {
    return res.status(403).render('user/error', {error: "You must be logged in to view your dashboard.Click below link to login :",link: "http://localhost:3000"})
  } else {
    next();
  }
});

app.use('/allRequests/:id', (req, res, next) => {
  if (!xss(req.session.user) && xss(req.session.role) !== "user") {
    return res.status(403).render('user/error', {error: "You must be logged in to view your dashboard.Click below link to login :",link: "http://localhost:3000"})
  } else {
    next();
  }
});

app.use('/allRequests/extension/:id', (req, res, next) => {
  if (!xss(req.session.user) && xss(req.session.role) !== "user") {
    return res.status(403).render('user/error', {error: "You must be logged in to view your dashboard.Click below link to login :",link: "http://localhost:3000"})
  } else {
    next();
  }
});

app.use('/bookCar/:id', (req, res, next) => {
  if (!xss(req.session.user) && xss(req.session.role) !== "user") {
    return res.status(403).render('user/error', {error: "You must be logged in to view your dashboard.Click below link to login :",link: "http://localhost:3000"})
  } else {
    next();
  }
});

app.use('/allRequests/extension/:id', (req, res, next) => {
  if (!xss(req.session.user) && xss(req.session.role) !== "user") {
    return res.status(403).render('user/error', {error: "You must be logged in to view your dashboard.Click below link to login :",link: "http://localhost:3000"})
  } else {
    next();
  }
});

app.use('/admin/adminDashboard', (req, res, next) => {
  if (!xss(req.session.user) && xss(req.session.role) !== "admin") {
    return res.status(403).render('user/error', {error: "You must be logged in to view your dashboard.Click below link to login :",link: "http://localhost:3000"})
  } else {
    next();
  }
});

app.use('/admin/cars/:id', (req, res, next) => {
  if (!xss(req.session.user) && xss(req.session.role) !== "admin") {
    return res.status(403).render('user/error', {error: "You must be logged in to view your dashboard.Click below link to login :",link: "http://localhost:3000"})
  } else {
    next();
  }
});

app.use('/admin/request/:id', (req, res, next) => {
  if (!xss(req.session.user) && xss(req.session.role) !== "admin") {
    return res.status(403).render('user/error', {error: "You must be logged in to view your dashboard.Click below link to login :",link: "http://localhost:3000"})
  } else {
    next();
  }
});

app.use('/admin/addCar', (req, res, next) => {
  if (!xss(req.session.user) && xss(req.session.role) !== "admin") {
    return res.status(403).render('user/error', {error: "You must be logged in to view your dashboard.Click below link to login :",link: "http://localhost:3000"})
  } else {
    next();
  }
});

app.use('/admin/deleteCar/:id', (req, res, next) => {
  if (!xss(req.session.user) && xss(req.session.role) !== "admin") {
    return res.status(403).render('user/error', {error: "You must be logged in to view your dashboard.Click below link to login :",link: "http://localhost:3000"})
  } else {
    next();
  }
});

app.use('/admin/carList', (req, res, next) => {
  if (!xss(req.session.user) && xss(req.session.role) !== "admin") {
    return res.status(403).render('user/error', {error: "You must be logged in to view your dashboard.Click below link to login :",link: "http://localhost:3000"})
  } else {
    next();
  }
});

app.use('/admin/editCar/:id', (req, res, next) => {
  if (!xss(req.session.user) && xss(req.session.role) !== "admin") {
    return res.status(403).render('user/error', {error: "You must be logged in to view your dashboard.Click below link to login :",link: "http://localhost:3000"})
  } else {
    next();
  }
});

app.use('/admin/approveRequest/:id', (req, res, next) => {
  if (!xss(req.session.user) && xss(req.session.role) !== "admin") {
    return res.status(403).render('user/error', {error: "You must be logged in to view your dashboard.Click below link to login :",link: "http://localhost:3000"})
  } else {
    next();
  }
});

app.use('/admin/rejectRequest/:id', (req, res, next) => {
  if (!xss(req.session.user) && xss(req.session.role) !== "admin") {
    return res.status(403).render('user/error', {error: "You must be logged in to view your dashboard.Click below link to login :",link: "http://localhost:3000"})
  } else {
    next();
  }
});

app.use('/admin/approveExtenRequest/:id', (req, res, next) => {
  if (!xss(req.session.user) && xss(req.session.role) !== "admin") {
    return res.status(403).render('user/error', {error: "You must be logged in to view your dashboard.Click below link to login :",link: "http://localhost:3000"})
  } else {
    next();
  }
});

app.use('/admin/rejectExtenRequest/:id', (req, res, next) => {
  if (!xss(req.session.user) && xss(req.session.role) !== "admin") {
    return res.status(403).render('user/error', {error: "You must be logged in to view your dashboard.Click below link to login :",link: "http://localhost:3000"})
  } else {
    next();
  }
});

app.use('/admin/request/ext/:id', (req, res, next) => {
  if (!xss(req.session.user) && xss(req.session.role) !== "admin") {
    return res.status(403).render('user/error', {error: "You must be logged in to view your dashboard.Click below link to login :",link: "http://localhost:3000"})
  } else {
    next();
  }
});

app.use('/admin/rentedCars', (req, res, next) => {
  if (!xss(req.session.user) && xss(req.session.role) !== "admin") {
    return res.status(403).render('user/error', {error: "You must be logged in to view your dashboard.Click below link to login :",link: "http://localhost:3000"})
  } else {
    next();
  }
});

app.engine('handlebars', exphbs({ defaultLayout: 'main' }));
app.set('view engine', 'handlebars');
configRoutes(app);

app.listen(3000, () => {
  console.log("We've now got a server!");
  console.log('Your routes will be running on http://localhost:3000');
});
