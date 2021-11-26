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

app.use(
  session({
    name: 'AuthCookie',
    secret: "This is a secret.. shhh don't tell anyone",
    saveUninitialized: true,
    resave: false,
    cookie: { maxAge: 60000 }
  })
);

app.use(async (req, res, next) => {
  let auth = req.session.user ? "(Authenticated User)" : "(Non-Authenticated User)"
  console.log(new Date().toUTCString() + ": " + req.method + " " + " " + req.originalUrl + " " + auth);
  next();
});

// app.use('/private', (req, res, next) => {
//   console.log(req.session.id);
//   if (!req.session.username && req.method === 'GET') {
//     return res.status(403).render('user/error');
//   } else {
//     next();
//   }
// });

app.engine('handlebars', exphbs({ defaultLayout: 'main' }));
app.set('view engine', 'handlebars');
configRoutes(app);

app.listen(3000, () => {
  console.log("We've now got a server!");
  console.log('Your routes will be running on http://localhost:3000');
});