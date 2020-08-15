const express = require('express');
const router = express.Router();

const homeController = require('../controllers/home_controller');

console.log('router loaded');
 
router.get('/', homeController.home);
router.use('/users', require('./users'));

// here module.exports and exports are not same,
// they are different which will be explained in later videos.
module.exports = router;
