const userData = require('./users');
const adminData = require('./admin');
const reviewData = require('./review');
const carsData = require('./cars');
const requestData = require('./requests')

module.exports = {
  users: userData,
  admin : adminData,
  reviews : reviewData,
  cars : carsData,
  requests: requestData
};