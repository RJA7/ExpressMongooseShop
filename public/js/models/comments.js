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

            if (!attrs.title) {
                return {message: 'Enter message title'};
            }

            if (attrs.title.length > 30) {
                return {message: 'Title is too long'};
            }

            if (!attrs.body) {
                return {message: 'Enter message text'};
            }
        }
    });
});
