define([
    'backbone',
    'models/admins'
], function (Backbone, Model) {
    return Backbone.Collection.extend({
        model: Model,
        limit: 5,
        sorts: 'firstName',

        url: function () {
            return '/admins';
        }
    });
});
