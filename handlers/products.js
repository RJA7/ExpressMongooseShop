var Product = require('../models/product');
var Comment = require('../models/comment');
var imager = require('../helpers/imager')();
var validator = require('../helpers/validator')();
var querator = require('../helpers/querator')();
var logger = require('../libs/log')(module);

var ObjectId = require('mongodb').ObjectID;

var pictureOption = {width: 400, height: 100, baseUrl: '/images/products/'};

module.exports = function () {
    var self = this;

    this.addProduct = function (req, res, next) {
        var body = req.body || {};
        var picture = req.files ? req.files.picture : null;

        validator.forProduct(body, {strict: true});
        validator.forPicture(picture) ? body.picturePath = imager
            .exec(picture, pictureOption) : delete body.picturePath;

        Product.create(body, function (err, product) {
            delete req.files;
            if (err) {
                return next(err);
            } else {
                return res.status(200).send(product);
            }
        });
    };

    this.getProducts = function (req, res, next) {
        var expand = req.query.expand;
        var filter = req.query.filter;
        var filterObj = [];
        var sort = req.query.sort || 'name';
        var order = parseInt(req.query.order) || 1;
        var sortObj = {};
        var deepSort = req.query.deepsort;
        var deepOrder = req.query.deeporder;
        var skip = parseInt(req.query.skip) || 0;
        var limit = parseInt(req.query.limit) || 50;
        var aggregateObj = [];
        var children = [];
        var i;

        if (filter) {
            filter = filter.split(',');
            for (i = 0; i < filter.length; i++) {
                filterObj.push({category: ObjectId(filter[i])});
            }

            aggregateObj.push({
                $match: {$or: filterObj}
            });
        }

        //count
        aggregateObj.push({
            $group: {
                _id: 'id',
                count: {$sum: 1}
            }
        });
        Product.aggregate(aggregateObj).exec(function (err, countObj) {
            if (err) {
                return next(err);
            }

            aggregateObj.pop();

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
                products[0] ? products[0].totalCount = countObj[0].count : null;

                return res.status(200).send(products);
            });
        });
    };

    this.getProduct = function (req, res, next) {
        var id = req.params.id;
        var expand = req.query.expand;
        var deepSort = req.query.deepsort;
        var deepOrder = req.query.deeporder;
        var aggregateObj = [{$match: {_id: ObjectId(id)}}];
        var children = [];
        var i;

        expand = (expand instanceof Array ? expand : [expand]);
        for (i = 0; i < expand.length; i++) {
            expand[i] == 'comments' ? children.push(Comment) : null;
        }

        aggregateObj.push({
            $lookup: {
                from: 'categories',
                localField: 'category',
                foreignField: '_id',
                as: 'category'
            }
        }, {
            $project: {
                _id: 1,
                name: 1,
                picturePath: 1,
                price: 1,
                producer: 1,
                count: 1,
                description: 1,
                comments: 1,
                category: {$arrayElemAt: ['$category', 0]}
            }
        }, {
            $project: {
                _id: 1,
                name: 1,
                picturePath: 1,
                price: 1,
                producer: 1,
                count: 1,
                description: 1,
                comments: 1,
                category: {_id: '$category._id', name: '$category.name'}
            }
        }, {
            $lookup: {
                from: 'producers',
                localField: 'producer',
                foreignField: '_id',
                as: 'producer'
            }
        }, {
            $project: {
                _id: 1,
                name: 1,
                picturePath: 1,
                price: 1,
                category: 1,
                count: 1,
                description: 1,
                comments: 1,
                producer: {$arrayElemAt: ['$producer', 0]}
            }
        }, {
            $project: {
                _id: 1,
                name: 1,
                picturePath: 1,
                price: 1,
                category: 1,
                count: 1,
                description: 1,
                comments: 1,
                producer: {_id: '$producer._id', name: '$producer.name'}
            }
        });

        aggregateObj = aggregateObj.concat(querator.generate({
            parent: Product, children: children, sort: deepSort, order: deepOrder
        }));

        Product.aggregate(aggregateObj).exec(function (err, products) {
            if (err) {
                return next(err);
            }

            return res.status(200).send(products[0]);
        });
    };

    this.changeProduct = function (req, res, next) {
        var body = req.body || {};
        var picture = req.files ? req.files.picture : null;

        validator.forProduct(body, {strict: false});
        validator.forPicture(picture) ? body.picturePath = imager
            .exec(picture, pictureOption) : delete body.picturePath;

        Product.findByIdAndUpdate(req.params.id, {$set: body},
            {new: true, lean: true}, function (err, product) {
                delete req.files;
                if (err) {
                    return next(err);
                }

                return self.getProduct(req, res, next);
            });
    };

    this.deleteProduct = function (req, res, next) {
        Product.findByIdAndRemove(req.params.id, function (err, product) {
            if (err) {
                return next(err);
            }

            return res.status(200).send(product);
        });
    };


    this.getProductComments = function (req, res, next) {
        var id = req.params.id;
        var aggregateObj = [{$match: {product: ObjectId(id)}}];
        var sort = req.query.sort || 'date';
        var order = parseInt(req.query.order) || 1;
        var skip = parseInt(req.query.skip) || 0;
        var limit = parseInt(req.query.limit) || 50;
        var sortObj = {};

        aggregateObj.push({
            $lookup: {
                from: 'users',
                localField: 'user',
                foreignField: '_id',
                as: 'user'
            }
        }, {
            $project: {
                _id: 1,
                title: 1,
                body: 1,
                date: 1,
                product: 1,
                user: {$arrayElemAt: ['$user', 0]}
            }
        }, {
            $project: {
                _id: 1,
                title: 1,
                body: 1,
                date: 1,
                product: 1,
                user: {_id: '$user._id', name: '$user.name', picturePath: '$user.picturePath'}
            }
        });

        Comment.count({user: id}).exec(function (err, count) {
            if (err) {
                return next(err);
            }

            sortObj[sort] = order;
            aggregateObj.push(
                {$sort: sortObj},
                {$skip: skip},
                {$limit: limit}
            );

            Comment.aggregate(aggregateObj).exec(function (err, comments) {
                if (err) {
                    return next(err);
                }

                comments = comments || [];
                comments[0] ? comments[0].totalCount = count : null;

                return res.status(200).send(comments);
            });
        });
    };

    this.searchProducts = function (req, res, next) {
        var word = req.params.word;
        var reg = new RegExp(word);

        Product
            .find()
            .or({name: reg})
            .or({description: reg})
            .exec(function (err, products) {
                if (err) {
                    return next(err);
                }

                return res.status(200).send(products);
            });
    }
}
;
