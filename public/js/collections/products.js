define([
    'backbone',
    'models/products'
], function (Backbone, Model) {
    return Backbone.Collection.extend({
        model: Model,
        limit: 6,
        sorts: 'name',

        url: function () {
            return '/products';
        }
    });
});
