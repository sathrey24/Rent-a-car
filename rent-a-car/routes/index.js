const userRoutes = require('./users');
const carRoutes = require('./cars');
//const adminRoutes = require('./admin');

const constructorMethod = (app) => {
  app.use('/', userRoutes);
  app.use('/cars', carRoutes);
  //app.use('/admin', adminRoutes);

  app.use('*', (req, res) => {
    res.status(404).render('user/error', {error: "<p> We're sorry, this page could not be found </p>"});
  });
};

module.exports = constructorMethod;