//Import (require) the auth controller
var authController = require('../controllers/authController.js');
console.log(authController)
//function passes passport into it from server.js
module.exports = function(app, passport) {

    //Defines the signup route 
    app.get('/signup', authController.signup);
    //Defines the signin route
    app.get('/signin', authController.signin);

    //apply strategy to /signup route
    //Defines the route for posting to signup
    app.post('/signup', passport.authenticate('local-signup', {
        successRedirect: '/dashboard',
 
        failureRedirect: '/signup'
    }
    ));

    //Defines the get route for the dashboard.hbs
    app.get('/dashboard', isLoggedIn, authController.dashboard);

    //Defines the get route for the protected route to dashboard (fail procedure)
    app.get('/logout', authController.logout);

    app.post('/signin', passport.authenticate('local-signin', {
        successRedirect: '/dashboard',
 
        failureRedirect: '/signin'
    }
 
    ));


function isLoggedIn(req, res, next) {
 
    if (req.isAuthenticated())
     
        return next();
         
    res.redirect('/signin');
} 
}