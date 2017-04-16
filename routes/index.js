var express = require('express');
var authenticate = require('./authenticate')();
var main = require('./main')();
var admin = require('./admin')();
var cart = require('./cart')();
var category = require('./category')();
var comment = require('./comment')();
var producer = require('./producer')();
var product = require('./product')();
var user = require('./user')();
var basket = require('./basket')();
var dispatch = require('./dispatch')();
var role = require('../helpers/role')();
var logger = require('../libs/log')(module);

module.exports = function (app) {
    app.use(authenticate);
    app.use('/', main);
    app.use('/admins', role.isAdmin, admin);
    app.use('/dispatch', role.isAdmin, dispatch);
    app.use('/carts', role.isUser, cart);
    app.use('/categories', category);
    app.use('/comments', comment);
    app.use('/producers', producer);
    app.use('/products', product);
    app.use('/users', role.isUser, user);
    app.use('/baskets', basket);
    
    app.use(notFound);
    app.use(errorHandler);
    
    return app;
};

function notFound(req, res, next) {
    var err = new Error('Not Found');
    err.status = 404;
    next(err);
}

function errorHandler(err, req, res, next) {
    if (err.code == 11000) {
        return res.status(400).send({error: true, message: 'This user already registered'});
    }

    var status = err.status || 500;

    if (process.env.NODE_ENV === 'production') {
        return res.status(status).send(err);
    } else {
        logger.error(err);
        return res.status(status).send(err);
    }
}
