// require environment variable file 
require('dotenv').config();

const express = require('express');
const cookieParser = require('cookie-parser');
const app = express();
const port = 8000;
const expressLayouts = require('express-ejs-layouts');
const db = require('./config/mongoose');

// used for seesion-cookie
const session = require('express-session');
const passport = require('passport');
const passportLocal = require('./config/passport-local-strategy');

const MongoStore = require('connect-mongo')(session);

// require node-sass-middleware
const sassMiddleware = require('node-sass-middleware');

// used for google authentication
const passportGoogle = require('./config/passport-google-oauth2-strategy');

// setting flash

const flash = require('connect-flash');
const customMware = require('./config/middleware');

app.use(sassMiddleware({
    src: './assets/scss', // from where to pick scss file
    dest: './assets/css', // where to put css file
    debug: true, // to display error, false for production mode
    outputStyle: 'extended', // single line or multiple lines
    prefix: '/css' // where should my server look for css files
}));

// for parsing post request data
app.use(express.urlencoded());

// for using cookies
app.use(cookieParser());


// serving static files
app.use(express.static('./assets'));

app.use(expressLayouts);

// extract style and scripts from sub pages into the layout
// static files for pages
app.set('layout extractStyles', true);
app.set('layout extractScripts', true);


// set up the view engine
app.set('view engine', 'ejs');
app.set('views', './views');

// middleware which takes the session cookie and
// encrypts it

// mongo store is used to store the session cookie in the db
app.use(session({
    name: 'codeial',
    // TODO change the secret before deployment in production mode
    secret: 'blahsomething',  // used for encryption
    saveUninitialized: false,  // whenever there is a request which is not initialised, 
    // a session which is not initialised, further means the user has not logged in, 
    // in this case i do not need to store extra data in the session cookie, so i set it to false
    resave: false,  
    // Explanation for resave: when identity is established or some sort of session-data is present in session - cookie,
    // i do not want to rewrite it again
    cookie: {
        maxAge: (1000 * 60 * 100)
    },
    store: new MongoStore(
        {
            mongooseConnection: db,
            autoRemove: 'disabled'
        },
        function(err) {
            console.log(err || 'connect-mongodb setup ok');
        }
    )
}));

// tell app to use passport
app.use(passport.initialize());
app.use(passport.session());

app.use(passport.setAuthenticatedUser);

// flash messages
app.use(flash());
app.use(customMware.setFlash);

// use express router
// for all request route to index.js in routes
app.use('/', require('./routes')); // it by default fetches index so no need to mention index


app.listen(port, function(err) {
    if(err)
    {
        console.log(`Error in running the server ${err}`);
        return;
    }

    console.log(`Server is running at port ${port}`);
});