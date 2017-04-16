define([
    'backbone',
    'underscore',
    'text!templates/main/header.html'
], function (Backbone, _, headerTemplate) {
    return Backbone.View.extend({
        tpl: _.template(headerTemplate),
        
        initialize: function () {
            this.render();
        },

        render: function () {
            this.$el.html(this.tpl());
        }
    });
});
