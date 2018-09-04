// =================================================================
// Dependencies
// =================================================================

//assigns the express module to a variable express
var express    = require('express');
//initialize express and name it variable called app
var app        = express();
//handles authentication
var passport   = require('passport');
var session    = require('express-session');
//extracts the entire body part of an incoming request and exposes it in JSON format
var bodyParser = require('body-parser');

//environment variable definition for local versus deployed or test environments
var env = require('dotenv').load();

//require handlebars middleware for the html translation
var exphbs = require('express-handlebars')

var models = require("./app/models");
//import signup route into server.js and pass in app and passport as arguments
var authRoute = require('./app/routes/auth.js')(app, passport);

//import passport strategies from passport.js
require('./app/config/passport/passport.js')(passport, models.user)



// =================================================================
// Initializing BodyParser, Passport, Express-session, and Passport Session
// =================================================================

//Body-parser: Allows the app (express) to use the body parser
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());

app.use(passport.initialize());
//Persistent login sessions
app.use(passport.session()); 

//Passport: Initializing Passport. Initializing express session and passport session as middleware
//Session secret
app.use(session({ secret: 'keyboard cat',resave: true, saveUninitialized:true}));

//Express routing function for get request to root (of localhost on port 3000)
app.get('/', function(req, res) {
//Typing localhost:3000 in the browser address bar will present the phrase listed below in the browser viewport
    res.send('App.get route in server.js is working. Sequelize is working');
 
});

//Sync Database
models.sequelize.sync().then(function() {
 
    console.log('Sequelize successfully setup')
 
}).catch(function(err) {
 
    console.log(err, "Something went wrong with the Database Update!")
 
});

//For Handlebars
app.set('views', './app/views')
app.engine('hbs', exphbs({
    extname: '.hbs'
}));
app.set('view engine', '.hbs')

//make app listen on port 3000 
app.listen(3000, function(err) {
 
    if (!err)
        console.log("Application is listening on port");
    else console.log(err)
 
});