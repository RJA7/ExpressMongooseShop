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
            attrs = attrs || {};

            if (!attrs.message) {
                return {message: 'Put some message'};
            }

            if (new Date(attrs.date) > new Date()) {
                return {message: 'Put correct date'};
            }
        }
    });
});
