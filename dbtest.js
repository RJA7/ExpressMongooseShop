var mongoose = require('mongoose');
var Schema = mongoose.Schema;
var ObjectId = Schema.Types.ObjectId;

var Cart = require('./models/cart');
var Category = require('./models/category');
var Comment = require('./models/comment');
var Producer = require('./models/producer');
var Product = require('./models/product');
var User = require('./models/user');
var Admin = require('./models/admin');
var querator = require('./helpers/querator')();

mongoose.connect('mongodb://127.0.0.1:27017/shoptest');

var o = {
    parent: User,
    children: [Cart, Comment]
};

var aggregateObj = querator.generate(o);
aggregateObj.push({$limit: 1});
// aggregateObj.push({$project: {__v: 0}});
// console.dir(aggregateObj);

User
    .aggregate(aggregateObj)
    .exec(function(err, user) {
        if (err) {
            console.dir(err);
        }
        console.log(user);
});



/*db.users.aggregate([ {$unwind: {path: '$friends', preserveNullAndEmptyArrays: true}}, //Розєднати по масиву friends
    {$lookup: {from: 'users', foreignField:'_id', localField: 'friends', as: 'friends'}}, //розвернути friends з users
    {$project: {firstName: 1, lastName: 1, dateOfBirth: 1, friends: {$arrayElemAt: ['$friends', 0]}}},//витянути friends[0]
    {$group:{_id: {_id: '$_id', firstName: '$firstName', lastName: '$lastName', dateOfBirth: '$dateOfBirth'},//груп по id
        friends: {$push: {firstName: '$friends.firstName', lastName: '$friends.lastName', dateOfBirth: '$friends.dateOfBirth'}}}},
    {$project: {_id: '$_id._id', firstName: '$_id.firstName', lastName: '$_id.lastName', dateOfBirth: '$_id.dateOfBirth', friends: 1}}]);*/
/*
{ '$unwind': { path: '$comments', preserveNullAndEmptyArrays: true } },
{ '$lookup':
    { from: 'users',
        foreignField: '_id',
        localField: 'comments',
        as: 'comments' } },
{ '$project':
    { admin: 1,
        picturePath: 1,
        email: 1,
        phone: 1,
        birthday: 1,
        status: 1,
        name: 1,
        password: 1,
        created: 1,
        carts: 1,
        comments: [Object],
        role: 1,
        verified: 1,
        _id: 1,
        __v: 1 } },
{ '$group': { _id: [Object], comments: [Object] } },
{ '$project':
    { admin: '$_id.admin',
        picturePath: '$_id.picturePath',
        email: '$_id.email',
        phone: '$_id.phone',
        birthday: '$_id.birthday',
        status: '$_id.status',
        name: '$_id.name',
        password: '$_id.password',
        created: '$_id.created',
        carts: '$_id.carts',
        comments: 1,
        role: '$_id.role',
        verified: '$_id.verified',
        _id: '$_id._id',
        __v: '$_id.__v' } }

        */
