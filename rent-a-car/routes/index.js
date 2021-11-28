const userRoutes = require('./users');
const carRoutes = require('./cars');

const constructorMethod = (app) => {
  app.use('/', userRoutes);
  app.use('/car', carRoutes);

  app.use('*', (req, res) => {
    res.status(404).render('user/error', {error: "<p> We're sorry, this page could not be found </p>"});
  });
};

module.exports = constructorMethod;