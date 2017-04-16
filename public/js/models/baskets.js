define([
    'backbone'
], function(Backbone) {
    return Backbone.Model.extend({
        idAttribute: '_id',

        initialize: function () {
            this.on('invalid', function (err) {
                APP.chanel.trigger('error', err.validationError);
            });
        }
    });
});
