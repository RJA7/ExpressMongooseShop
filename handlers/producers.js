var Producer = require('../models/producer');
var Product = require('../models/product');
var imager = require('../helpers/imager')();
var validator = require('../helpers/validator')();
var querator = require('../helpers/querator')();
var logger = require('../libs/log')(module);

var ObjectId = require('mongodb').ObjectID;

var pictureOption = {width: 400, height: 100, baseUrl: '/images/producers/'};

module.exports = function () {

    this.addProducer = function (req, res, next) {
        var body = req.body || {};
        var picture = req.files ? req.files.picture : null;

        validator.forProducer(body, {role: req.user.role, strict: true});
        validator.forPicture(picture) ? body.picturePath = imager
            .exec(picture, pictureOption) : delete body.picturePath;

        Producer.create(body, function (err, producer) {
            delete req.files;
            if (err) {
                return next(err);
            } else {
                return res.status(200).send(producer);
            }
        });
    };

    this.getProducers = function (req, res, next) {
        var expand = req.query.expand;
        var sort = req.query.sort || 'name';
        var order = parseInt(req.query.order) || 1;
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
            parent: Producer, children: children, sort: deepSort, order: deepOrder
        }));

        Producer.count(aggregateObj).exec(function (err, count) {
            if (err) {
                return next(err);
            }

            sortObj[sort] = order;
            aggregateObj.push(
                {$sort: sortObj},
                {$skip: skip},
                {$limit: limit}
            );

            Producer.aggregate(aggregateObj).exec(function (err, producers) {
                if (err) {
                    return next(err);
                }

                producers = producers || [];
                producers[0] ? producers[0].totalCount = count : null;
                
                return res.status(200).send(producers);
            });
        });
    };

    this.getProducer = function (req, res, next) {
        var id = req.params.id;
        var expand = req.query.expand;
        var deepSort = req.query.deepsort;
        var deepOrder = req.query.deeporder;
        var aggregateObj = [{$match: {"_id": ObjectId(id)}}];
        var children = [];
        var i;

        expand = (expand instanceof Array ? expand : [expand]);
        for (i = 0; i < expand.length; i++) {
            expand[i] == 'products' ? children.push(Product) : null;
        }

        aggregateObj = aggregateObj.concat(querator.generate({
            parent: Producer, children: children, sort: deepSort, order: deepOrder
        }));

        Producer.aggregate(aggregateObj).exec(function (err, producers) {
            if (err) {
                return next(err);
            }

            return res.status(200).send(producers[0]);
        });
    };

    this.changeProducer = function (req, res, next) {
        var body = req.body || {};
        var picture = req.files ? req.files.picture : null;

        validator.forProducer(body, {strict: false});
        validator.forPicture(picture) ? body.picturePath = imager
            .exec(picture, pictureOption) : delete body.picturePath;

        Producer.findByIdAndUpdate(req.params.id, {$set: body},
            {new: true, lean: true}, function (err, producer) {
                delete req.files;
                if (err) {
                    return next(err);
                }

                return res.status(200).send(producer);
            });
    };

    this.deleteProducer = function (req, res, next) {
        Producer.findByIdAndRemove(req.params.id, function (err, producer) {
            if (err) {
                return next(err);
            }

            return res.status(200).send(producer);
        });
    };


    this.getProducerProducts = function (req, res, next) {
        var id = req.params.id;
        var aggregateObj = [{$match: {producer: ObjectId(id)}}];
        var sort = req.query.sort || 'name';
        var order = parseInt(req.query.order) || 1;
        var skip = parseInt(req.query.skip) || 0;
        var limit = parseInt(req.query.limit) || 5;
        var sortObj = {};

        Product.count({producer: id}).exec(function (err, count) {
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
