var Category = require('../models/category');
var Product = require('../models/product');
var imager = require('../helpers/imager')();
var validator = require('../helpers/validator')();
var querator = require('../helpers/querator')();
var logger = require('../libs/log')(module);

var ObjectId = require('mongodb').ObjectID;

var pictureOption = {width: 400, height: 100, baseUrl: '/images/categories/'};

module.exports = function () {

    this.addCategory = function (req, res, next) {
        var body = req.body || {};
        var picture = req.files ? req.files.picture : null;

        validator.forCategory(body, {strict: true});
        validator.forPicture(picture) ? body.picturePath = imager
            .exec(picture, pictureOption) : delete body.picturePath;

        Category.create(body, function (err, category) {
            delete req.files;
            if (err) {
                return next(err);
            } else {
                return res.status(200).send(category);
            }
        });
    };

    this.getCategories = function (req, res, next) {
        var expand = req.query.expand;
        var sort = req.query.sort || 'name';
        var order = parseInt(req.query.order) || 1;
        var sortObj = {};
        var deepSort = req.query.deepsort;
        var deepOrder = req.query.deeporder;
        var skip = parseInt(req.query.skip) || 0;
        var limit = parseInt(req.query.limit) || 100;
        var children = [];
        var aggregateObj = [];
        var i;

        expand = (expand instanceof Array ? expand : [expand]);
        for (i = 0; i < expand.length; i++) {
            expand[i] === 'products' ? children.push(Product) : null;
        }

        aggregateObj = aggregateObj.concat(querator.generate({
            parent: Category,
            children: children, sort: deepSort, order: deepOrder
        }));

        Category.count(aggregateObj).exec(function (err, count) {
            if (err) {
                return next(err);
            }

            sortObj[sort] = order;
            aggregateObj.push(
                {$sort: sortObj},
                {$skip: skip},
                {$limit: limit}
            );

            Category.aggregate(aggregateObj).exec(function (err, categories) {
                if (err) {
                    return next(err);
                }

                categories = categories || [];
                categories[0] ? categories[0].totalCount = count : null;

                return res.status(200).send(categories);
            });
        });
    };

    this.getCategory = function (req, res, next) {
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
            parent: Category,
            children: children, sort: deepSort, order: deepOrder
        }));

        Category.aggregate(aggregateObj).exec(function (err, categories) {
            if (err) {
                return next(err);
            }

            return res.status(200).send(categories[0]);
        });
    };

    this.changeCategory = function (req, res, next) {
        var id = req.params.id;
        var body = req.body || {};
        var picture = req.files ? req.files.picture : null;

        validator.forCategory(body, {strict: false});
        validator.forPicture(picture) ? body.picturePath = imager
            .exec(picture, pictureOption) : delete body.picturePath;

        Category.findByIdAndUpdate(id, {$set: body},
            {new: true, lean: true}, function (err, category) {
                delete req.files;
                if (err) {
                    return next(err);
                }

                return res.status(200).send(category);
            });
    };

    this.deleteCategory = function (req, res, next) {
        Category.findByIdAndRemove(req.params.id, function (err, category) {
            if (err) {
                return next(err);
            }

            return res.status(200).send(category);
        });
    };
    
    
    this.getCategoryProducts = function (req, res, next) {
        var id = req.params.id;
        var aggregateObj = [{$match: {category: ObjectId(id)}}];
        var sort = req.query.sort || 'name';
        var order = parseInt(req.query.order) || 1;
        var skip = parseInt(req.query.skip) || 0;
        var limit = parseInt(req.query.limit) || 50;
        var sortObj = {};

        Product.count({category: id}).exec(function (err, count) {
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
    }
};
