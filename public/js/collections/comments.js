define([
    'backbone',
    'models/comments'
], function (Backbone, Model) {
    return Backbone.Collection.extend({
        model: Model,
        limit: 5,
        sorts: 'date',

        url: function () {
            return '/comments';
        }
    });
});
