define([
    'backbone',
    'models/producers'
], function (Backbone, Model) {
    return Backbone.Collection.extend({
        model: Model,
        limit: 5,
        sorts: 'name',

        url: function () {
            return '/producers';
        }
    });
});
