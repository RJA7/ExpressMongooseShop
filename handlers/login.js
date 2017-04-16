var User = require('../models/user');
var crypter = require('../helpers/crypter')();
var mailer = require('../helpers/mailer')();
var messenger = require('../helpers/messenger')();
var validator = require('validator');
var myValidator = require('../helpers/validator')();
var phone = require('phone');
var randomString = require('random-strings');
var path = require('path');

module.exports = function () {

    this.fillUser = function (req, res, next) {
        req.user = {};

        if (req.session.user && req.session.user.id) {
            User
                .findByIdAndUpdate(req.session.user.id, {$set: {lastVisited: Date.now()}})
                .exec(function (err, user) {
                    if (err || !user) {
                        req.user.role = 'ANON';

                        return next();
                    }
                    req.user.role = user.role;
                    req.user.status = user.status;
                    req.user.id = user.id;

                    return next();
                });
        } else {
            req.user.role = 'ANON';

            return next();
        }
    };

    this.register = function (req, res, next) {
        var body = req.body || {};
        delete body.picturePath;

        myValidator.forUser(body, {strict: true, role: 'ANON'}, function (err) {
            if (err) {
                return res.status(200).send({
                    message: err.message,
                    error: true
                });
            } else {
                User.create(body, function (err) {
                    if (err) {
                        return next(err);
                    }

                    return res.status(200).send({
                        success: true,
                        message: 'Successfully registered'
                    });
                });
            }
        });
    };

    this.login = function (req, res, next) {
        var body = req.body || {};
        var login = body.login || '';
        var password = crypter.crypt(body.password);
        var code = body.code || '';
        var rememberMe = body.rememberMe;
        var tmp;

        if (!validator.isEmail(login)) {
            login = phone(login, 'UKR').shift();
        }

        User
            .findOne()
            .or({email: login})
            .or({phone: login})
            .where('password').equals(password)
            .lean()
            .exec(function (err, user) {
                if (err) {
                    return next(err);
                }
                if (!user) {
                    return res.status(200).send({error: true, message: 'Wrong login or password'});
                }

                if (code && req.session.code) {
                    if (code === req.session.code) {
                        req.session.user = user;
                        req.session.user.id = user._id;
                        req.session.name = user.name;

                        delete req.session.code;
                        delete user.password;

                        rememberMe ? req.session.cookie.maxAge = 3600 * 24000 * 90 :
                            req.session.cookie.expires = false;

                        return res.status(200).send({success: true, message: 'Logged in'});
                    } else {
                        return res.status(200).send({error: true, message: 'Wrong code'});
                    }
                }
                else {
                    code = randomString.numeric(4);
                    req.session.code = code;

                    if (validator.isEmail(login)) {
                        mailer.send(user.email, code, 'accept');
                        tmp = 'email';
                    } else {
                        messenger.send(user.phone, code, 'accept');
                        tmp = 'phone';
                    }

                    return res.status(200).send({codec: true, message: 'Code sent to your ' + tmp});
                }
            });
    };

    this.logout = function (req, res, next) {
        delete req.session.user;
        req.user = {role: 'ANON'};
        req.session.cookie.maxAge = 3600 * 24000 * 90;

        return res.status(200).send(req.user);
    };

    this.forgot = function (req, res, next) {
        var body = req.body || {};
        var login = body.login || '';
        var isEmail = validator.isEmail(login);
        var code = body.code || '';
        var type = 'email';
        var request;
        var trying;
        var message;

        if (!isEmail) {
            login = phone(login, 'UKR').shift();
            type = 'phone';
        }

        User
            .findOne({})
            .or({email: login})
            .or({phone: login})
            .exec(function (err, user) {
                if (err) {
                    return next(err);
                }
                if (!user) {
                    return res.json({error: true, message: 'Wrong login'});
                }

                if (code !== '' && req.session.forgot) {
                    if (code === req.session.forgot) {
                        var newPassword = randomString.alphaNumMixed(10);

                        user.password = newPassword;

                        user.save(function (err, user) {
                            if (err) {
                                return next(err);
                            }

                            isEmail ?
                                mailer.send(user.email, newPassword, 'restore') :
                                messenger.send(user.phone, newPassword, 'restore');

                            return res.status(200).send({
                                success: true, message: 'New Password sent to your ' + type
                            });
                        });
                    } else {
                        trying = req.session.try--;
                        message = 'Wrong code ' + trying + ' trying';
                        if (!trying) {
                            delete req.session.forgot;
                            message = 'Request new code';
                            request = true;
                        }

                        return res.status(200).send({
                            error: true, message: message, request: request
                        });
                    }
                }
                else {
                    code = randomString.numeric(4);
                    req.session.forgot = code;
                    req.session.try = 3;

                    isEmail ?
                        mailer.send(user.email, code, 'forgot') :
                        messenger.send(user.phone, code, 'forgot');

                    return res.status(200).send({
                        codec: true, message: 'Code sent to your ' + type
                    });
                }
            });
    };
};
