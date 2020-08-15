const passport = require('passport');

const LocalStrategy = require('passport-local').Strategy;

const User = require('../models/user');

const bcrypt = require('bcrypt');

const flash = require('connect-flash');

// finding the user and authentication using passport
passport.use(new LocalStrategy({
        usernameField: 'email',
        passReqToCallback:true,//this is done to set req option in passport to display flash messages for reason login was unsuccessful
    },
    function(req, email, password, done) {
        // find a user and establish connection
        // first email is database email , second email is argument passed to function
        User.findOne({email: email}, function(err, user) {
            if(err) {
                console.log('Error in finding user --> passport');
                return done(err);
            }

            // const salt = bcrypt.genSaltSync(10);
            // const hash = bcrypt.hashSync(req.body.password, salt);
            // req.body.password = hash;
            // // user not found or password don't match
            // if(!user || user.password !== req.body.password) {
            //     console.log('Invalid username/password');
            //     return done(null, false);   // take two argument, first one is error
            // }

            // // user found
            // return done(null, user);   // return user to serializer

            bcrypt.compare(password,user.password, function(err, result) {
                if(result){
                    return done(null,user);
                }
                else{
                    console.log('from passport , passwod not match');
                    req.flash('error','Invalid Password');    
                    return done(null,false);
                }
            });

        });
    }    
));


// serializing the user to decide which key is to be kept in the cookies

passport.serializeUser(function(user, done) {
    done(null, user.id);  // we just want to store user id in cookie
});

// deserializing the user from the key in the cookies
passport.deserializeUser(function(id, done) {
    User.findById(id, function(err, user) {
        if(err) {
            console.log('Error in finding user');
            return done(err);
        }

        return done(null, user);  // user is found
    });
});


// setting current authenticated user


// check if the user is authenticated
// it will be used as a middleware
// for example, if user is logged in, show profile page
passport.checkAuthentication = function(req, res, next) {
    // if user is signed in
    //  let user view the page
    // i.e, pass request to the next function which is
    // controllers action
    if(req.isAuthenticated()){
        return next();
    }

    // if the user is not signed in
    return res.redirect('/users/sign-in');
}

// for every request, this function will be called and user
// will be set in the locals, app.use is used in index.js
passport.setAuthenticatedUser = function(req, res, next) {
    if(req.isAuthenticated()) {
        // req.user contains the current signed in user
        // from the session cookie and we are just sending
        // this to the locals for the views
        res.locals.user = req.user;  // if user is signed in , user information is available in
        // request
    }

    next();
}

module.exports = passport;