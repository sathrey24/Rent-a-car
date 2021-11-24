const userData = require('./users');
const adminData = require('./admin');
const reviewData = require('./review');
const carsData = require('./cars');

module.exports = {
  users: userData,
  admin : adminData,
  reviews : reviewData,
  cars : carsData
};