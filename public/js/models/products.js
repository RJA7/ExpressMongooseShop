define([
    'backbone'
], function (Backbone) {
    return Backbone.Model.extend({
        idAttribute: '_id',

        initialize: function () {
            this.on('invalid', function (err) {
                APP.chanel.trigger('error', err.validationError);
            });
        },

        validate: function (attrs) {
            attrs = attrs || {};

            if (!attrs.name) {
                return {message: 'Enter product name'};
            }

            if (!attrs.price) {
                return {message: 'Enter product price'};
            }

            if (!attrs.count) {
                return {message: 'Enter product count'};
            }
        }
    });
});
