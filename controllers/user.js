/**
 * Created by 450 G4 on 3/27/2017.
 */
const encryption = require('./../utilities/encryption');
const User = require('mongoose').model('User');
const Role = require('mongoose').model('Role');


module.exports = {
    registerGet: (req, res) => {
        res.render('user/register');
    },

    registerPost: (req, res) => {
        let registerArgs = req.body;

        User.findOne({email: registerArgs.email}).then(user => {
            // console.log(user);
            let errorMsg = '';
            if (user) {
                errorMsg = 'User with the same username exists!';
            }
            else if (registerArgs.password !== registerArgs.repeatedPassword) {
                errorMsg = 'Password do not match!'
            }

            if (errorMsg) {
                registerArgs.error = errorMsg;
                res.render('user/register', registerArgs);
            }
            else {
                let salt = encryption.generateSalt();
                let passwordHash = encryption.hashPassword(registerArgs.password, salt);
                let roles = [];
                Role.findOne({name: 'User'}).then(role => {
                    roles.push(role.id);

                    let userObject = {
                        email: registerArgs.email,
                        passwordHash: passwordHash,
                        fullName: registerArgs.fullName,
                        salt: salt,
                        roles: roles
                    };
                    User.create(userObject).then(user => {
                        user.prepareInsert();
                        req.logIn(user, (err) => {
                            if (err) {
                                registerArgs.error = err.message;
                                res.render('user/register', registerArgs);
                                return;
                            }

                            res.redirect('/');
                        })

                    })
                });
            }
        })
    },

    loginGet: (req, res) => {
        res.render('user/login');
    },

    loginPost: (req, res) => {
        let loginArgs = req.body;
        User.findOne({email: loginArgs.email}).then(user => {
            // console.log(user);
            let errorMsg = '';
            if (!user || !user.authenticate(loginArgs.password)) {
                errorMsg = 'Either username or password is invalid!';
                loginArgs.error = errorMsg;
                res.render('user/login', loginArgs);
                return;
            }

            req.logIn(user, (err) => {
                if (err) {
                    console.log(err);
                    res.redirect('/user/login', {error: err.message});
                    return;
                }

                let returnUrl = '/';
                if (req.session.returnUrl) {
                    returnUrl = req.session.returnUrl;
                    delete req.session.returnUrl;
                }
                res.redirect(returnUrl);
            })
        })
    },

    logout: (req, res) => {
        req.logOut();
        res.redirect('/');
    },

    detailsGet: (req, res) => {
        res.render('user/profile');
    },

    detailsPost: (req, res) => {
        let id = req.params.id;
        let profileArgs = req.body;

        if (!req.isAuthenticated()) {
            errorMsg = 'You should be logged in to update your profile!';
        }
        if (errorMsg) {
            res.render('article/create', {error: errorMsg});
            return;
        }
        profileArgs.user = req.user.id;
        Profile.create(articleArgs).then(article => {
            req.user.articles.push(article.id);
            req.user.save(err => {
                if (err) {
                    res.redirect('/', {error: err.message});
                }
                else {
                    res.redirect('/');
                }
            });
        })


        User.findOne({email: registerArgs.email}).then(user => {
            // console.log(user);
            let errorMsg = '';
            if (errorMsg) {
                registerArgs.error = errorMsg;
                res.render('user/profile', registerArgs);
            }
            else {
                let salt = encryption.generateSalt();
                let passwordHash = encryption.hashPassword(registerArgs.password, salt);
                let roles = [];
                Role.findOne({name: 'User'}).then(role => {
                    roles.push(role.id);

                    let userObject = {
                        email: registerArgs.email,
                        passwordHash: passwordHash,
                        fullName: registerArgs.fullName,
                        salt: salt,
                        roles: roles
                    };
                    User.create(userObject).then(user => {
                        role.users.push(user.id);
                        role.save(err => {
                            if (err) {
                                registerArgs.error = err.message;
                                res.render('user/register', registerArgs);
                            }
                            else {
                                req.logIn(user, (err) => {
                                    if (err) {
                                        registerArgs.error = err.message;
                                        res.render('user/register', registerArgs);
                                        return;
                                    }
                                    res.redirect('/');
                                })
                            }
                        });
                    })
                });
            }
        })
        if (image) {
            let filename = image.name;
            image.mv(`./public/images/${filename}`, err => {
                if (err) {
                    console.log(err.message);
                }
            });
        }

        let detailsArgs = req.body;

        let errorMsg = '';

        if (!req.isAuthenticated()) {
            errorMsg = 'You should be logged!';
        }

        detailsArgs.imagePath = `/images/${image.name}`;


        res.redirect('user/details')
    }

};
