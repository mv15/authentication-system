const User = require('../models/user');
// require // require environment variable file 
require('dotenv').config();

const nodemailer = require("nodemailer");
const bcrypt = require('bcrypt');

const flash = require('connect-flash');

//we use nodemailer to create a transport from which our mail are being sent Please set the user and pass before firing up the server
//nodemailer uses SMTP protocol to send the mail
var transporter = nodemailer.createTransport({
    source: "gmail",
    host: "smtp.gmail.com", // hostname
    secure: false, // use SSL
    port: 25, // port for secure SMTP
    auth: {
        user: process.env.username,
        pass: process.env.password,
    },
    tls: {
        rejectUnauthorized: false
    }
});

module.exports.profile = function(req, res) {
    res.render('user_profile', {
        title: "User profile"
    });
};

// render sign up file
module.exports.signUp = function(req, res) {

    // restrict access
    if(req.isAuthenticated()) {
        return res.redirect('/users/profile');
    }

    return res.render('user_sign_up', {
        title: "Sign up"
    });
};

// render sign in file

module.exports.signIn = function(req, res) {
  
    if(req.isAuthenticated()) {
        return res.redirect('/users/profile');
    }
    
    return res.render('user_sign_in', {
        title: "Sign In"
    });
};

// get the sign up data
module.exports.create = function(req, res) {
    // TODO later
    if(req.body.password != req.body.confirm_password) {
        req.flash('success', 'password does not match');
        console.log(req.flash('success'));
        return res.redirect('back');
    }

    User.findOne({email : req.body.email}, function(err, user) {
        if(err) { console.log('error in finding user in signing up'); return;}

        if(!user) {
            // store hash
            const salt = bcrypt.genSaltSync(10);
            const hash = bcrypt.hashSync(req.body.password, salt);
            req.body.password = hash;
            User.create(req.body, function(err, user) {     // additional fields in req.body will not be saved
                if(err) { console.log('error in creating user while signing up'); return;}

                return res.redirect('/users/sign-in');
            })
        } else {
            return res.redirect('back');
        }
    });
}

// for sign in and create a session
module.exports.createSession = function(req, res) {
    // user is signed in, i just need to redirect.
    // when passport.js use localstrategy to authenticate the user,
    // the control comes here, session is created in passport.js
    req.flash('success', 'Logged In SUccessfully');
    return res.redirect('/');
}

// for sign out
module.exports.destroySession = function(req, res) {
    req.logout();   // passport gives logout function to req

    req.flash('success', 'Logged Out Successfully');
    return res.redirect('/');
};

// for forgot password, get user email in the form
module.exports.forgotPassword = function(req, res) {
    return res.render('forgot_password.ejs', {
        title: "Forgot Password"
    });
}

module.exports.sendLink = function(req, res) {
    // Extract email and send link : TODO
    console.log(req.body.email);

    User.findOne({email : req.body.email}, function(err, user) {
        if(err) { console.log('error in finding user in signing up'); return;}

        if(!user) {
            // user does not exist in the database
            req.flash('error', 'user does not exist in the database');
            return res.redirect('/users/sign-in');
        } else {
            // Send Link : TODO
            console.log('send password change link');

            let otp=rand=Math.floor((Math.random() * 100000) + Math.floor((Math.random()*1000))); //generate an random otp
            //define what is to be sent on the mail
            let mailOptions={
                to : req.body.email,
                subject : "Your One Time Password",
                html : `Hello, Your OTP is ${otp}`,
            }
            console.log(mailOptions);
            //save otp in data base
            user.otp=otp;
            user.save();
            //use our transporter to send the mail to user email
            transporter.sendMail(mailOptions, function(err,data){
                console.log('Email not successfully');
                if(err){
                    return res.redirect('back');
                }
                req.flash('success','OTP Sent on your email');
                console.log('Email sent successfully');
              
                return res.render('reset_password',{
                    title:'Authenticate | verify',
                });
            });  


            // return res.redirect("/users/sign-in");
        };
    });
};

// for reset password on profile page
module.exports.resetPassword = function(req, res) {
    // verify otp and check if entered password are same
    // if same add to database and redirect to sign in
    // console.log('Reset password called');
    // console.log('Req. body', req.body);

    User.findOne({email:req.body.email}, function(err,user) {

        if(err) { console.log('error in resetting password'); return;}

        // uses does not exist
        if(!user){
            // console.log('user does not exist');
            req.flash('error','user does not exist');
            return res.redirect('/users/forgot-password');
        }
        // otp must be same
        if(user.otp != req.body.otp){
            // console.log('incorrect otp');
            req.flash('error','Incorrect OTP, please try again');
            return res.redirect('/users/forgot-password');
        }
        // console.log(req.body.password);
        // console.log(req.body.confirmpassword)
        if(req.body.password != req.body.confirmpassword){
            // console.log('password are not same');
            req.flash('error','Password Dont Match');
            return res.redirect('/users/forgot-password');
        }
        user.otp = null;
        const salt = bcrypt.genSaltSync(10);
        const hash = bcrypt.hashSync(req.body.password, salt);
        user.password = hash;
        // user.password = req.body.password;
        user.save();
        req.logOut();
        req.flash('success','Password Reset Successfuly');
        return res.redirect('/users/sign-in');
    });
};

module.exports.reset = function(req, res) {
    req.logout();
    return res.render('forgot_password', {
        title: "Reset password"
    });
};