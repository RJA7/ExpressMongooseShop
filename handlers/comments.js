var Comment = require('../models/comment');
var validator = require('../helpers/validator')();
var querator = require('../helpers/querator')();
var logger = require('../libs/log')(module);

var ObjectId = require('mongodb').ObjectID;

module.exports = function () {

    this.addComment = function (req, res, next) {
        var body = req.body || {};
        body.user = req.user.id;

        validator.forComment(body, {strict: true});

        Comment.create(body, function (err, comment) {
            if (err) {
                return next(err);
            } else {
                return res.status(200).send(comment);
            }
        });
    };

    this.getComments = function (req, res, next) {
        var sort = req.query.sort || 'user';
        var order = parseInt(req.query.order) || 1;
        var sortObj = {};
        var skip = parseInt(req.query.skip) || 0;
        var limit = parseInt(req.query.limit) || 100;
        var aggregateObj = [];

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
                product: 1,
                user : {$arrayElemAt: ['$user', 0]}
            }
        }, {
            $project: {
                _id  : 1,
                title: 1,
                body : 1,
                date : 1,
                product: 1,
                user : {_id: '$user._id', name: '$user.name', picturePath: '$user.picturePath'}
            }
        });

        Comment.count(aggregateObj).exec(function (err, count) {
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

    this.getComment = function (req, res, next) {
        var aggregateObj = [{$match: {_id: ObjectId(req.params.id)}}];
        var expand = req.query.expand;

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
                product: 1,
                user : {$arrayElemAt: ['$user', 0]}
            }
        }, {
            $project: {
                _id  : 1,
                title: 1,
                body : 1,
                date : 1,
                product: 1,
                user : {_id: '$user._id', name: '$user.name', picturePath: '$user.picturePath'}
            }
        });

        Comment
            .aggregate(aggregateObj)
            .exec(function (err, comments) {
                if (err) {
                    return next(err);
                }

                return res.status(200).send(comments[0]);
            });
    };

    this.changeComment = function (req, res, next) {
        var body = req.body || {};

        validator.forComment(body, {strict: false});

        Comment.findByIdAndUpdate(req.params.id, {$set: body},
            {new: true, lean: true}, function (err, comment) {
                if (err) {
                    return next(err);
                }

                return res.status(200).send(comment);
            });
    };

    this.deleteComment = function (req, res, next) {
        Comment.findByIdAndRemove(req.params.id, function (err, comment) {
            if (err) {
                return next(err);
            }

            return res.status(200).send(comment);
        });
    }
};
