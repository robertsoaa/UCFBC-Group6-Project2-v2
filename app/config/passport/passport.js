//passport.js file contains the passport strategies

//imports bcrypt (npm package used to secure passwords)
var bCrypt = require('bcrypt-nodejs');

module.exports = function(passport, user) {
    //initialize the user model
    var User = user;
    
    //initialize the passport-local strategy
    var LocalStrategy = require('passport-local').Strategy;
    
    //defines a custom strategy with the instance of the LocalStrategy
    //translates request(req) fields into passport variables
    //custom strategy equals username as an email address (passport variable = usernameField) and the password as a password (passport variable = passwordField) 
    passport.use('local-signup', new LocalStrategy(
 
        {
            usernameField: 'email',
            passwordField: 'password',
            // passes back the entire request to the callback
            passReqToCallback: true 
     
        },
        //function handles storing a user's details
        function(req, email, password, done) {
            //hashed password generating function
            var generateHash = function(password) {
 
                return bCrypt.hashSync(password, bCrypt.genSaltSync(8), null);
 
            };
            //run a check to see if the user already exists
            User.findOne({
                where: {
                    email: email
                }
            }).then(function(user) {
 
                if (user)
 
                {
 
                    return done(null, false, {
                        message: 'That email is already taken'
                    });
 
                } else
 
                {
 
                    var userPassword = generateHash(password);
 
                    var data =
 
                        {
                            email: email,
 
                            password: userPassword,
 
                            firstname: req.body.firstname,
 
                            lastname: req.body.lastname
 
                        };
                    //Use User.create Sequelize method to add new entries to the database
                    User.create(data).then(function(newUser, created) {
 
                        if (!newUser) {
 
                            return done(null, false);
 
                        }
                        if (newUser) {
 
                            return done(null, newUser);
                        }
 
                    });
 
                }
 
            });
 
        }
 
    ));

//Local Strategy for Sign-in

passport.use('local-signin', new LocalStrategy(
 
    {
 
        // local strategy uses email as the username and password is encrypted by bcrypt
 
        usernameField: 'email',
 
        passwordField: 'password',
        // allows us to pass back the entire request to the callback
        passReqToCallback: true 
 
    },
 
 
    function(req, email, password, done) {
 
        var User = user;
        //isValidPassword function compares the password entered with the bCrypt comparison method (compareSync)
        var isValidPassword = function(userpass, password) {
 
            return bCrypt.compareSync(password, userpass);
 
        }
 
        User.findOne({
            where: {
                email: email
            }
        }).then(function(user) {
 
            if (!user) {
 
                return done(null, false, {
                    message: 'Email does not exist'
                });
 
            }
 
            if (!isValidPassword(user.password, password)) {
 
                return done(null, false, {
                    message: 'Incorrect password.'
                });
 
            }
 
 
            var userinfo = user.get();
            return done(null, userinfo);
 
 
        }).catch(function(err) {
 
            console.log("Error:", err);
 
            return done(null, false, {
                message: 'Something went wrong with your Signin'
            });
 
        });
 
 
    }
 
));



    //serialize function to save the user id into the session
    //User ID is used to manage retrieving the user details
    passport.serializeUser(function(user, done) {
 
    done(null, user.id);
 
});

    // deserialize user. Sequelize getter function is used to "get" the User object from the instance
    passport.deserializeUser(function(id, done) {
 
    User.findById(id).then(function(user) {
 
        if (user) {
 
            done(null, user.get());
 
        } else {
 
            done(user.errors, null);
 
        }
 
    });
 
});
};