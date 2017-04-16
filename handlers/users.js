var User = require('../models/user');
var Cart = require('../models/cart');
var Comment = require('../models/comment');
var imager = require('../helpers/imager')();
var validator = require('../helpers/validator')();
var querator = require('../helpers/querator')();
var logger = require('../libs/log')(module);

var ObjectId = require('mongodb').ObjectID;

var pictureOption = {width: 400, height: 100, baseUrl: '/images/users/'};

module.exports = function () {

    this.addUser = function (req, res, next) {
        var body = req.body || {};
        var picture = req.files ? req.files.picture : null;

        validator.forUser(body, {role: req.user.role, strict: true});
        validator.forPicture(picture) ? body.picturePath = imager
            .exec(picture, pictureOption) : delete body.picturePath;

        User.create(body, function (err, user) {
            delete req.files;
            if (err) {
                return next(err);
            }
            user = user || {};
            user.password = '';

            return res.status(200).send(user);
        });
    };

    this.getUsers = function (req, res, next) {
        var expand = req.query.expand;
        var sort = req.query.sort || 'name';
        var order = parseInt(req.query.order) || 1;
        var sortObj = {};
        var deepSort = req.query.deepsort;
        var deepOrder = req.query.deeporder;
        var skip = parseInt(req.query.skip) || 0;
        var limit = parseInt(req.query.limit) || 10;
        var aggregateObj = [];
        var children = [];
        var i;

        expand = (expand instanceof Array ? expand : [expand]);
        for (i = 0; i < expand.length; i++) {
            expand[i] === 'carts' ? children.push(Cart) : null;
            expand[i] === 'comments' ? children.push(Comment) : null;
        }

        aggregateObj = aggregateObj.concat(querator.generate({
            parent: User, children: children, sort: deepSort, order: deepOrder
        }));

        User.count(aggregateObj).exec(function (err, count) {
            if (err) {
                return next(err);
            }

            sortObj[sort] = order;
            aggregateObj.push(
                {$sort: sortObj},
                {$skip: skip},
                {$limit: limit}
            );

            User.aggregate(aggregateObj).exec(function (err, users) {
                if (err) {
                    return next(err);
                }

                users = users || [];
                users[0] ? users[0].totalCount = count : null;

                for (i = 0; i < users.length; i++) {
                    delete users[i].password;
                }

                return res.status(200).send(users);
            });
        });
    };

    this.getUser = function (req, res, next) {
        var id = req.params.id == 1 ? req.user.id : req.params.id;
        var expand = req.query.expand;
        var deepSort = req.query.deepsort;
        var deepOrder = req.query.deeporder;
        var aggregateObj = [{$match: {_id: ObjectId(id)}}];
        var children = [];
        var i;

        expand = (expand instanceof Array ? expand : [expand]);
        for (i = 0; i < expand.length; i++) {
            expand[i] == 'carts' ? children.push(Cart) : null;
            expand[i] == 'comments' ? children.push(Comment) : null;
        }

        aggregateObj = aggregateObj.concat(querator.generate({
            parent: User, children: children, sort: deepSort, order: deepOrder
        }));

        User.aggregate(aggregateObj).exec(function (err, users) {
            if (err) {
                return next(err);
            }
            users[0] = users[0] || {};
            delete users[0].password;

            return res.status(200).send(users[0]);
        });
    };

    this.changeUser = function (req, res, next) {
        var body = req.body || {};
        var picture = req.files ? req.files.picture : null;
        var id = req.user.role !== 'ADMIN' ? req.user.id : req.params.id;

        validator.forUser(body, {role: req.user.role, strict: false});
        validator.forPicture(picture) ? body.picturePath = imager
            .exec(picture, pictureOption) : delete body.picturePath;

        User.findByIdAndUpdate(id, {$set: body},
            {new: true, lean: true}, function (err, user) {
                delete req.files;
                if (err) {
                    return next(err);
                }
                user = user || {};
                delete user.password;

                return res.status(200).send(user);
            });
    };

    this.deleteUser = function (req, res, next) {
        var id = req.user.role === 'ADMIN' ? req.params.id : req.user.id;

        User.findByIdAndRemove(id, {lean: true}, function (err, user) {
            if (err) {
                return next(err);
            }
            user ? delete user.password : null;

            return res.status(200).send(user);
        });
    };


    this.getUserCarts = function (req, res, next) {
        var id = req.params.id;
        var aggregateObj = [{$match: {user: ObjectId(id)}}];
        var sort = req.query.sort || 'date';
        var order = parseInt(req.query.order) || 1;
        var skip = parseInt(req.query.skip) || 0;
        var limit = parseInt(req.query.limit) || 3;
        var sortObj = {};

        Cart.count({user: id}).exec(function (err, count) {
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

    this.getUserComments = function (req, res, next) {
        var id = req.params.id;
        var aggregateObj = [{$match: {user: ObjectId(id)}}];
        var sort = req.query.sort || 'date';
        var order = parseInt(req.query.order) || 1;
        var skip = parseInt(req.query.skip) || 0;
        var limit = parseInt(req.query.limit) || 3;
        var sortObj = {};

        aggregateObj.push({
            $lookup: {
                from        : 'users',
                localField  : 'user',
                foreignField: '_id',
                as          : 'user'
            }
        }, {
            $project: {
                _id  : 1,
                title: 1,
                body : 1,
                date : 1,
                user : {$arrayElemAt: ['$user', 0]}
            }
        }, {
            $project: {
                _id  : 1,
                title: 1,
                body : 1,
                date : 1,
                user : {_id: '$user._id', name: '$user.name', picturePath: '$user.picturePath'}
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
    }
};
