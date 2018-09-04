var exports = module.exports = {}

//controller for user signup (i.e. site registration)
exports.signup = function(req, res) {
 
    res.render('signup');
 
}

//controller for users sign-in to application
exports.signin = function(req, res) {
 
    res.render('signin');
 
}

//controller for the dashboard
exports.dashboard = function(req, res) {
 
    res.render('dashboard');
 
}

//controller for the logout if user fails authentication
exports.logout = function(req, res) {
 
    req.session.destroy(function(err) {
 
        res.redirect('/');
 
    });
 
}