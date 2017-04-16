var Cart = require('../models/cart');
var Product = require('../models/product');
var validator = require('../helpers/validator')();
var querator = require('../helpers/querator')();
var messenger = require('../helpers/messenger')();
var logger = require('../libs/log')(module);

var ObjectId = require('mongodb').ObjectID;

module.exports = function () {

    this.addCart = function (req, res, next) {
        var body = req.body || {};
        body.user = req.user.id;

        validator.forCart(body, {strict: true});

        Cart.create(body, function (err, cart) {
            if (err) {
                return next(err);
            } else {
                messenger.send(process.env.ownerPhone, 'New cart! TechShop');

                return res.status(200).send(cart);
            }
        });
    };

    this.getCarts = function (req, res, next) {
        var expand = req.query.expand;
        var sort = req.query.sort || 'orderDate';
        var order = parseInt(req.query.order) || -1;
        var sortObj = {};
        var deepSort = req.query.deepsort;
        var deepOrder = req.query.deeporder;
        var skip = parseInt(req.query.skip) || 0;
        var limit = parseInt(req.query.limit) || 100;
        var aggregateObj = [];
        var children = [];
        var i;

        expand = (expand instanceof Array ? expand : [expand]);
        for (i = 0; i < expand.length; i++) {
            expand[i] === 'products' ? children.push(Product) : null;
        }

        aggregateObj = aggregateObj.concat(querator.generate({
            parent: Cart, children: children, sort: deepSort, order: deepOrder
        }));

        Cart.count(aggregateObj).exec(function (err, count) {
            if (err) {
                return next(err);
            }

            sortObj[sort] = order;
            aggregateObj.push(
                {$sort: sortObj},
                {$skip: skip},
                {$limit: limit}
            );

            Cart.aggregate(aggregateObj).exec(function (err, carts) {
                if (err) {
                    return next(err);
                }

                carts = carts || [];
                carts[0] ? carts[0].totalCount = count : null;

                return res.status(200).send(carts);
            });
        });
    };

    this.getCart = function (req, res, next) {
        var id = req.params.id;
        var expand = req.query.expand;
        var deepSort = req.query.deepsort;
        var deepOrder = req.query.deeporder;
        var aggregateObj = [{$match: {_id: ObjectId(id)}}];
        var children = [];
        var i;

        expand = (expand instanceof Array ? expand : [expand]);
        for (i = 0; i < expand.length; i++) {
            expand[i] == 'products' ? children.push(Product) : null;
        }

        aggregateObj = aggregateObj.concat(querator.generate({
            parent: Cart, children: children, sort: deepSort, order: deepOrder
        }));

        Cart.aggregate(aggregateObj).exec(function (err, carts) {
            if (err) {
                return next(err);
            }

            return res.status(200).send(carts[0]);
        });
    };

    this.changeCart = function (req, res, next) {
        var body = req.body || {};

        validator.forCart(body, {strict: false});

        Cart.findByIdAndUpdate(req.params.id, {$set: body},
            {new: true, lean: true}, function (err, cart) {
                delete req.files;
                if (err) {
                    return next(err);
                }

                return res.status(200).send(cart);
            });
    };

    this.deleteCart = function (req, res, next) {
        Cart.findByIdAndRemove(req.params.id, function (err, cart) {
            if (err) {
                return next(err);
            }

            return res.status(200).send(cart);
        });
    };


    this.getCartProducts = function (req, res, next) {
        var id = req.params.id;
        var aggregateObj = [{$match: {carts: ObjectId(id)}}];
        var sort = req.query.sort || 'orderDate';
        var order = parseInt(req.query.order) || 1;
        var skip = parseInt(req.query.skip) || 0;
        var limit = parseInt(req.query.limit) || 5;
        var sortObj = {};

        Product.count({carts: id}).exec(function (err, count) {
            if (err) {
                return next(err);
            }

            sortObj[sort] = order;
            aggregateObj.push(
                {$sort: sortObj},
                {$skip: skip},
                {$limit: limit}
            );

            Product.aggregate(aggregateObj).exec(function (err, products) {
                if (err) {
                    return next(err);
                }

                products = products || [];
                products[0] ? products[0].totalCount = count : null;

                return res.status(200).send(products);
            });
        });
    };
};
