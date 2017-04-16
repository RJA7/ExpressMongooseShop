var mongoose = require('mongoose');
var Schema = mongoose.Schema;
var ObjectId = Schema.Types.ObjectId;
var crypter = require('../helpers/crypter')();
var phone = require('phone');

var defaultPictureUrl = '/images/users/default.jpg';

//Parent for Admin, Cart, Comment
var UserSchema = Schema({
    admin: {
        type: ObjectId,
        ref: 'admin'
    },

    picturePath: {
        type: String,
        default: defaultPictureUrl
    },

    email: {
        type: String,
        required: [true, 'email is required'],
        unique: true,
        validate: [validateEmail, 'Wrong email format']
    },

    phone: {
        type: String,
        required: [true, 'phone is required'],
        unique: true,
        validate: [validatePhone, 'Wrong phone format'],
        set: setPhone
    },

    birthday: Date,

    lastVisited: {
        type: Date
    },
    
    status: {
        type: Boolean,
        default: true
    },

    name: {
        type: String,
        required: [true, 'name is required'],
        minlength: [3, 'Name is too short'],
        maxlength: [32, 'Name is too long']
    },

    password: {
        type: String,
        required: [true, 'password is required'],
        set: setPassword
    },

    created: {
        type: Date,
        default: Date.now()
    },

    carts: [{
        type: ObjectId,
        ref: 'cart'
    }],

    comments: [{
        type: ObjectId,
        ref: 'comment'
    }],
    
    role: {
        type: String,
        default: 'USER',
        enum: ['USER', 'ADMIN']
    },
    
    gender: {
        type: String,
        enum: ['Male', 'Female']
    },
    
    address: {
        type: String
    }
});

var User = mongoose.model('user', UserSchema);

module.exports = User;


function validateEmail(email) {
    var emailReg = /[\w]{3,}[\@][a-zA-Z]{1,5}[\.][a-zA-Z]{2,5}/;
    return emailReg.test(email);
}

function validatePhone(phone) {
    var phoneReg = /[\+]?[\d]{10,12}/;
    return phoneReg.test(phone);
}

function setPassword(password) {
    return crypter.crypt(password);
}

function setPhone(num) {
    return phone(num, 'UKR').shift();
}
