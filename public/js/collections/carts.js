define([
    'backbone',
    'models/carts'
], function (Backbone, Model) {
    return Backbone.Collection.extend({
        model: Model,
        limit: 5,
        sorts: 'orderDate',

        url: function () {
            return '/carts';
        }
    });
});
