const express = require('express');
const router = express.Router();
const mapController = require('./controllers/mapController');
const userController = require('./controllers/userController');

router.get('/getData', mapController.getHeat, (req, res, next) => {
  return next();
})

router.post('/addUser', userController.addUser, (req, res, next) => {
  return next();
})

router.get('/getFaves', userController.getFavorites, (req, res, next) => {
  return next();
})

router.post('/addFaves', userController.addFavorite, (req, res, next) => {
  return next();
})

router.delete('/deleteFaves', userController.deleteFavorite, (req, res, next) => {
  return next();
})


module.exports = router;