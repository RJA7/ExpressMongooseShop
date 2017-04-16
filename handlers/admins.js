var Admin = require('../models/admin');
var User = require('../models/user');
var validator = require('../helpers/validator')();
var imager = require('../helpers/imager')();
var logger = require('../libs/log')(module);

var ObjectId = require('mongodb').ObjectID;

var pictureOption = {width: 400, height: 100, baseUrl: '/images/users/'};

module.exports = function () {
    var self = this;

    this.addAdmin = function (req, res, next) {
        var body = req.body || {};
        var picture = req.files ? req.files.picture : null;

        validator.forAdmin(body, {strict: true});
        validator.forUser(body, {strict: true});
        validator.forPicture(picture) ? body.picturePath = imager
            .exec(picture, pictureOption) : delete body.picturePath;

        body.role = 'ADMIN';
        User.create(body, function (err, user) {
            delete req.files;
            if (err) {
                return next(err);
            }

            body.user = user;
            Admin.create(body, function (err, admin) {
                if (err) {
                    return next(err);
                }

                return res.status(200).send(admin);
            });
        });
    };

    this.getAdmins = function (req, res, next) {
        var expand = req.query.expand;
        var sort = req.query.sort || 'firstName';
        var order = parseInt(req.query.order) || 1;
        var sortObj = {};
        var skip = parseInt(req.query.skip) || 0;
        var limit = parseInt(req.query.limit) || 100;
        var aggregateObj = [];

        expand === 'user' ? aggregateObj.push({
            $lookup: {
                from: 'users',
                localField: 'user', foreignField: '_id', as: 'user'
            }
        }, {
            $project: {
                _id: 1,
                lastName: 1,
                firstName: 1,
                address: 1,
                user: {$arrayElemAt: ['$user', 0]}
            }
        }) : null;

        Admin.count(aggregateObj).exec(function (err, count) {
            if (err) {
                return next(err);
            }

            sortObj[sort] = order;
            aggregateObj.push(
                {$sort: sortObj},
                {$skip: skip},
                {$limit: limit}
            );

            Admin.aggregate(aggregateObj).exec(function (err, admins) {
                if (err) {
                    return next(err);
                }

                admins = admins || [];
                admins[0] ? admins[0].totalCount = count : null;

                return res.status(200).send(admins);
            });
        });
    };

    this.getAdmin = function (req, res, next) {
        var id = req.params.id;
        var aggregateObj = [{$match: {_id: ObjectId(id)}}];
        aggregateObj.push({
            $lookup: {
                from: 'users',
                localField: 'user', foreignField: '_id', as: 'user'
            }
        }, {
            $project: {
                _id: 1,
                lastName: 1,
                firstName: 1,
                address: 1,
                user: {$arrayElemAt: ['$user', 0]}
            }
        });

        Admin.aggregate(aggregateObj).exec(function (err, admins) {
            if (err) {
                return next(err);
            }
            admins[0] = admins[0] || {};
            admins[0].user = admins[0].user || {};
            delete admins[0].user.password;

            return res.status(200).send(admins[0]);
        });
    };

    this.changeAdmin = function (req, res, next) {
        var body = req.body || {};
        var picture = req.files ? req.files.picture : null;

        validator.forAdmin(body, {strict: false});
        validator.forUser(body, {strict: false});
        validator.forPicture(picture) ? body.picturePath = imager
            .exec(picture, pictureOption) : delete body.picturePath;

        Admin.findByIdAndUpdate(req.params.id, {$set: body},
            {new: true, lean: true}, function (err, admin) {
                if (err) {
                    return next(err);
                }

                User.findByIdAndUpdate(admin.user, {$set: body},
                    {new: true, lean: true}, function (err, user) {
                        delete req.files;
                        if (err) {
                            return next(err);
                        }

                        return self.getAdmin(req, res, next);
                    });
            });
    };

    this.deleteAdmin = function (req, res, next) {
        Admin.findByIdAndRemove(req.params.id, function (err, admin) {
            if (err) {
                return next(err);
            }

            return res.status(200).send(admin);
        });
    }
};
