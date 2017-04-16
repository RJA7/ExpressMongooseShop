define([
    'backbone'
], function(Backbone) {
    return Backbone.Model.extend({
        idAttribute: '_id',

        initialize: function () {
            this.on('invalid', function (err) {
                APP.chanel.trigger('error', err.validationError);
            });
        },

        validate: function (attrs) {
            var phoneReg = /[\+]?[\d]{10,12}/;
            var emailReg = /[\w]{3,}[\@][a-zA-Z]{1,5}[\.][a-zA-Z]{2,5}/;
            attrs = attrs || {};

            if (attrs.password !== attrs.confirmPassword) {
                return {message: 'Passwords must be equals'};
            }

            if (!attrs.name) {
                return {message: 'Enter your name'};
            }

            if (attrs.name && attrs.name.length < 3) {
                return {message: 'Name is too short'};
            }

            if (attrs.name && attrs.name.length > 32) {
                return {message: 'Name is too long'};
            }

            if (attrs.password && attrs.password.length < 6) {
                return {message: 'Min password length is 6'};
            }

            if (!attrs.phone) {
                return {message: 'Enter your phone'};
            }

            if (!attrs.email) {
                return {message: 'Enter your email'};
            }

            if (!phoneReg.test(attrs.phone)) {
                return {message: 'Invalid phone'};
            }

            if (!emailReg.test(attrs.email)) {
                return {message: 'Invalid email'};
            }

            if (!attrs.firstName) {
                return {message: 'First name is required'};
            }

            if (!attrs.lastName) {
                return {message: 'Last name is required'};
            }

            if (!attrs.address) {
                return {message: 'Address is required for admin'};
            }
        }
    });
});
