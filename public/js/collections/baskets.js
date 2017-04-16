define([
    'backbone',
    'models/baskets'
], function (Backbone, Model) {
    return Backbone.Collection.extend({
        model: Model,

        url: function () {
            return '/baskets';
        }
    });
});
