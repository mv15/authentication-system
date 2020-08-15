const express = require('express');
const router = express.Router();
const passport = require('passport');

const usersController = require('../controllers/users_controller');

router.get('/profile', passport.checkAuthentication, usersController.profile);

// for sign up
router.get('/sign-up', usersController.signUp);

// route for sign in
router.get('/sign-in', usersController.signIn);

router.post('/create', usersController.create);

// use passport as a middleware to authenticate
router.post('/create-session', passport.authenticate(
    'local', // strategy
    {failureRedirect: '/users/sign-in'}
),usersController.createSession);

// for sign out
router.get('/sign-out', usersController.destroySession);


// for google sign in
router.get('/auth/google', passport.authenticate('google', {scope: ['profile', 'email']}));     // first argument is given by the passport
// scope is the information which we want to get from google, email is not a part of profile, we need to take permission to access email

// first is the url on which i receive the data, 
// userscontroller.createSession is redirecting me to home page
router.get('/auth/google/callback', passport.authenticate('google', {failureRedirect: '/users/sign-in'}), usersController.createSession);


// render forgot-password on sign in page
router.get('/forgot-password', usersController.forgotPassword);

// send email and show reset password page
router.post('/send-email', usersController.sendLink);

// reset-password , enter otp and new password twice 
router.post('/reset-password', usersController.resetPassword);


router.get('/reset', usersController.reset);

module.exports = router;